import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet';
import { LatLng, Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the meetup locations
const MEETUP_LOCATIONS = [
  { id: 'loc1', name: 'City Center Mall', address: 'West Bay, Doha', coordinates: { lat: 25.3285, lng: 51.5310 } },
  { id: 'loc2', name: 'Villaggio Mall', address: 'Al Waab Street, Doha', coordinates: { lat: 25.2599, lng: 51.4441 } },
  { id: 'loc3', name: 'Place Vendome', address: 'Lusail, Doha', coordinates: { lat: 25.4106, lng: 51.4904 } }
];

// Define seller location (example coordinates in Doha)
const SELLER_LOCATION: [number, number] = [25.2867, 51.5333]; // Doha coordinates

// Define the bounds for Doha
const DOHA_BOUNDS: LatLngBounds = new LatLngBounds(
  [25.2307, 51.3967], // Southwest coordinates
  [25.3875, 51.6267]  // Northeast coordinates
);

interface CheckoutFormProps {
  onCancel: () => void;
}

// Map picker component
const MapPicker: React.FC<{ onLocationSelect: (latlng: LatLng) => void }> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<LatLng | null>(null);

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng);
      },
    });

    return position === null ? null : (
      <>
        <Marker position={position}>
        </Marker>
        <Circle center={position} radius={1000} />
      </>
    );
  };

  return (
    <MapContainer
      center={[25.2867, 51.5333]}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: '300px', width: '100%' }}
      maxBounds={DOHA_BOUNDS}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

const calculateDeliveryFee = (distance: number): number => {
  const baseFare = 3.0;
  const perKmRate = 1.5;
  const distanceFare = distance * perKmRate;
  const totalFare = baseFare + distanceFare;
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
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleLocationChange = async (latlng: LatLng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      );
      
      if (response.data.display_name) {
        const distance = calculateDistance(
          SELLER_LOCATION[0],
          SELLER_LOCATION[1],
          latlng.lat,
          latlng.lng
        );
        
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
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
            Contact Number
          </label>
          <input
            type="tel"
            id="contact"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Method
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="mr-2"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="meetup"
                checked={formData.paymentMethod === 'meetup'}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="mr-2"
              />
              Meetup
            </label>
          </div>
        </div>

        {formData.paymentMethod === 'meetup' && (
          <div>
            <label htmlFor="meetupLocation" className="block text-sm font-medium text-gray-700">
              Meetup Location
            </label>
            <select
              id="meetupLocation"
              value={formData.meetupLocation}
              onChange={(e) => setFormData({ ...formData, meetupLocation: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
            >
              {MEETUP_LOCATIONS.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.paymentMethod === 'cod' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Delivery Location
              </label>
              <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-300">
                <MapPicker onLocationSelect={handleLocationChange} />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Delivery Address
              </label>
              <textarea
                id="address"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

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