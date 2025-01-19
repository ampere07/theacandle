import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();

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
            <div className="flex space-x-8">
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
            </div>
          </div>
        </div>
      </nav>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;