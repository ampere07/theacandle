import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut } from 'lucide-react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user?.photoURL || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user?.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
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