import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

interface CheckoutFormProps {
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onCancel }) => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    paymentMethod: 'cod'
  });
  const [loading, setLoading] = useState(false); 

  const API_URL = import.meta.env.PROD
    ? 'https://theacandle.onrender.com'
    : 'http://localhost:3000'; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Sending order data to backend:', {
        ...formData,
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      });

      // Send the order data without storing the response variable
      await axios.post(`${API_URL}/api/orders`, {
        ...formData,
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      });

      clearCart();
      onCancel();
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false); // Re-enable the button after the request
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-medium mb-4">Checkout</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
        <input
          type="tel"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
        >
          <option value="cod">Cash on Delivery</option>
          <option value="meetup">Meet Up</option>
        </select>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-700"
          disabled={loading} // Disable the button when loading
        >
          {loading ? 'Placing Order...' : 'Place Order'} {/* Show loading text */}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
