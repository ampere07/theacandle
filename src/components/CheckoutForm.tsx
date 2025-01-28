import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet';
import { LatLng, Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ... (keep existing interfaces and constants)

const calculateDeliveryFee = (distance: number): number => {
  // Base fare
  const baseFare = 3.0;
  
  // Per kilometer rate
  const perKmRate = 1.5;
  
  // Calculate total fare
  const distanceFare = distance * perKmRate;
  const totalFare = baseFare + distanceFare;
  
  // Round to 2 decimal places
  return Math.round(totalFare * 100) / 100;
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onCancel }) => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    paymentMethod: 'cod',
    meetupLocation: MEETUP_LOCATIONS[0].id,
    coordinates: { lat: 0, lng: 0 }
  });
  const [deliveryFee, setDeliveryFee] = useState(0);

  const API_URL = 'https://theacandle.onrender.com';

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const handleLocationChange = async (latlng: LatLng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      );
      
      if (response.data.display_name) {
        // Calculate distance from seller location
        const distance = calculateDistance(
          SELLER_LOCATION[0],
          SELLER_LOCATION[1],
          latlng.lat,
          latlng.lng
        );
        
        // Calculate delivery fee
        const fee = calculateDeliveryFee(distance);
        setDeliveryFee(fee);

        setFormData({
          ...formData,
          address: response.data.display_name,
          coordinates: { lat: latlng.lat, lng: latlng.lng }
        });
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (formData.paymentMethod === 'cod' ? deliveryFee : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        address: formData.paymentMethod === 'meetup' 
          ? MEETUP_LOCATIONS.find(loc => loc.id === formData.meetupLocation)?.address 
          : formData.address,
        items: cartItems,
        deliveryFee: formData.paymentMethod === 'cod' ? deliveryFee : 0,
        subtotal,
        total
      };

      await axios.post(`${API_URL}/api/orders`, orderData);
      clearCart();
      onCancel();
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-medium mb-4">Checkout</h2>
      
      {/* ... (keep existing form fields) */}

      <div className="border-t pt-4 mt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>QAR{subtotal.toFixed(2)}</span>
          </div>
          {formData.paymentMethod === 'cod' && (
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>QAR{deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>QAR{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-700"
        >
          Place Order
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