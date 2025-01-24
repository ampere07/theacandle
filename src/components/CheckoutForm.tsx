import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet';
import { LatLng, Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CheckoutFormProps {
  onCancel: () => void;
}

const MEETUP_LOCATIONS = [
  { id: 'sm-north', name: 'SM North EDSA', address: 'North Ave, Quezon City, Metro Manila' },
  { id: 'sm-moa', name: 'SM Mall of Asia', address: 'Mall of Asia Complex, Pasay City' },
  { id: 'robinsons-manila', name: 'Robinsons Place Manila', address: 'Ermita, Manila' },
  { id: 'megamall', name: 'SM Megamall', address: 'Ortigas Center, Mandaluyong City' },
];

// Fix for the default marker icon
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Doha, Qatar coordinates
const DOHA_CENTER = [25.2854, 51.5310];
const SELLER_LOCATION = [25.2606, 51.4506]; // Nuaija coordinates
const QATAR_BOUNDS = new LatLngBounds(
  [24.4539, 50.7500], // Southwest
  [26.1834, 51.6834]  // Northeast
);

function LocationMarker({ onLocationChange }: { onLocationChange: (latlng: LatLng) => void }) {
  const [position, setPosition] = useState<LatLng | null>(null);
  
  useMapEvents({
    click(e) {
      if (QATAR_BOUNDS.contains(e.latlng)) {
        setPosition(e.latlng);
        onLocationChange(e.latlng);
      } else {
        alert('Please select a location within Qatar');
      }
    },
  });

  return (
    <>
      {position && <Marker position={position} icon={defaultIcon} />}
      <Marker 
        position={SELLER_LOCATION as [number, number]} 
        icon={defaultIcon}
      >
      </Marker>
      <Circle 
        center={SELLER_LOCATION as [number, number]}
        radius={1000}
        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
      />
    </>
  );
}

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

  const API_URL = import.meta.env.PROD 
    ? 'https://theacandle.onrender.com' 
    : 'http://localhost:3000';

  const handleLocationChange = async (latlng: LatLng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      );
      
      if (response.data.display_name) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        address: formData.paymentMethod === 'meetup' 
          ? MEETUP_LOCATIONS.find(loc => loc.id === formData.meetupLocation)?.address 
          : formData.address,
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
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

      {formData.paymentMethod === 'meetup' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700">Meet-up Location</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
            value={formData.meetupLocation}
            onChange={(e) => setFormData({ ...formData, meetupLocation: e.target.value })}
          >
            {MEETUP_LOCATIONS.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            <MapPin className="inline-block w-4 h-4 mr-1" />
            {MEETUP_LOCATIONS.find(loc => loc.id === formData.meetupLocation)?.address}
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
          <input
            type="text"
            required
            placeholder="Click on the map to set your address"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <div className="mt-2 h-48 w-full rounded-lg overflow-hidden">
            <MapContainer
              center={DOHA_CENTER}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              maxBounds={QATAR_BOUNDS}
              maxBoundsViscosity={1.0}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker onLocationChange={handleLocationChange} />
            </MapContainer>
          </div>
          <p className="mt-1 text-sm text-gray-500">Click on the map to set your delivery location</p>
        </div>
      )}

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