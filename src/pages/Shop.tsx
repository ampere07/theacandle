import React from 'react';
import { useCart } from '../context/CartContext';
import bear from '../images/bear.jpg';
import flowerbubble from '../images/flowerbubble.png';
import flower from '../images/flower.jpg';
import flowerwarp from '../images/flowerwrap.jpg';
import rose from '../images/rose.jpeg';
import small from '../images/small.jpg';

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
    </div>
  );
};

export default Shop;