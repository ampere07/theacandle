import React from 'react';
import { useCart } from '../context/CartContext';
import bear from '../images/bear.jpg';
import bearflower from '../images/bearflower.jpg';
import flower from '../images/flower.jpg';
import flowerwarp from '../images/flowerwrap.jpg';
import heartflower from '../images/heartflower.png';
import small from '../images/small.jpg';

const products = [
  {
    id: '1',
    name: 'Flower ni Papa P',
    price: 24.99,
    image: flower,  // Use the imported image
  },
  {
    id: '2',
    name: 'Mama Bear',
    price: 29.99,
    image: bearflower,  // Use the imported image
  },
  {
    id: '3',
    name: 'Bear Brand',
    price: 27.99,
    image: bear,  // Use the imported image
  },
  {
    id: '4',
    name: 'Tortilla Wrap',
    price: 29.99,
    image: flowerwarp,  // Use the imported image
  },
  {
    id: '5',
    name: 'Flower ni Jhayvot G',
    price: 29.99,
    image: heartflower,  // Use the imported image
  },
  {
    id: '6',
    name: 'Juts',
    price: 29.99,
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