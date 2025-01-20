import React from 'react';
import { useCart } from '../context/CartContext';
import bear from '../images/bear.jpg';
import flowerbubble from '../images/flowerbubble.png';
import flower from '../images/flower.jpg';
import flowerwarp from '../images/flowerwrap.jpg';
import rose from '../images/rose.jpeg';
import small from '../images/small.jpg';
import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

const products = [
  {
    id: '1',
    name: 'Heartfelt Blooms',
    price: 8,
    image: flower,  // Use the imported image
  },
  {
    id: '2',
    name: 'Blush of Peony',
    price: 30,
    image: rose,  // Use the imported image
  },
  {
    id: '3',
    name: 'Bear in Bloom',
    price: 15,
    image: bear,  // Use the imported image
  },
  {
    id: '4',
    name: 'Blooming Bouquet',
    price: 15,
    image: flowerwarp,  // Use the imported image
  },
  {
    id: '5',
    name: 'Heart Bubble Candle',
    price: 35,
    image: flowerbubble,  // Use the imported image
  },
  {
    id: '6',
    name: 'Rosy Reverie',
    price: 15,
    image: small,  // Use the imported image
  },
];

const Shop = () => {
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif mb-8 text-center">Our Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-medium mb-2">{product.name}</h2>
              <p className="text-stone-600 mb-4">QAR{product.price}</p>
              <button
                onClick={() => addToCart({ ...product, quantity: 1 })}
                className="w-full bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-serif text-white mb-4">Reign Co.</h3>
              <p className="mb-4">Embrace the glow.</p>
              <div className="flex items-center space-x-4">
                <a href="https://www.instagram.com/reigncoqa?igsh=MXJ1cmJzcGQxcnR4Yg==" className="hover:text-white transition-colors">Instagram</a>
                <a href="https://www.facebook.com/profile.php?id=61567747556945&mibextid=JRoKGi" className="hover:text-white transition-colors">Facebook</a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Nuaija, Qatar Doha
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  +974 5531 1390
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  manaorthea@gmail.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-700 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Reign Co. All rights reserved.<br />This website is developed and maintained by Ampere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Shop;