import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User, History, ChevronRight } from 'lucide-react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <nav className="bg-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-serif text-stone-800">
                Reign Co.
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-stone-600 hover:text-stone-900">
                Home
              </Link>
              <Link to="/shop" className="text-stone-600 hover:text-stone-900">
                Shop
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-stone-600 hover:text-stone-900 relative"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-800 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={user?.photoURL || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-stone-200"
                  />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user?.photoURL || 'https://via.placeholder.com/40'}
                          alt="Profile"
                          className="w-12 h-12 rounded-full border border-gray-200"
                        />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium text-gray-900">
                            {user?.displayName || 'User'}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-3 text-gray-400" />
                          <span>Profile</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <div className="flex items-center">
                          <History className="w-4 h-4 mr-3 text-gray-400" />
                          <span>Purchase History</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;