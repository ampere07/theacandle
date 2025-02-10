import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutForm from './CheckoutForm';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, isLoading } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  const handleQuantityUpdate = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
      return;
    }

    try {
      setIsUpdating(id);
      await updateQuantity(id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      setIsUpdating(id);
      await removeFromCart(id);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {isCheckingOut ? (
            <CheckoutForm onCancel={() => setIsCheckingOut(false)} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-stone-800" />
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p className="text-center mb-2">Your cart is empty</p>
                    <p className="text-sm text-center">Add some items to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-4 border-b pb-4 relative ${
                          isUpdating === item.id ? 'opacity-50' : ''
                        }`}
                      >
                        {isUpdating === item.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                            <Loader2 className="h-6 w-6 animate-spin text-stone-800" />
                          </div>
                        )}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">QAR{item.price.toFixed(2)}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                              className="px-2 py-1 border rounded hover:bg-gray-50 transition-colors"
                              disabled={isUpdating === item.id}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                              className="px-2 py-1 border rounded hover:bg-gray-50 transition-colors"
                              disabled={isUpdating === item.id}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition-colors p-2"
                          disabled={isUpdating === item.id}
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t p-4 bg-gray-50">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">QAR{total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setIsCheckingOut(true)}
                  disabled={cartItems.length === 0 || isLoading}
                  className="w-full bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;