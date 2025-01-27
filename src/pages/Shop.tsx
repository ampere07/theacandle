import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import AddToCartModal from '../components/AddToCartModal';

const products = [
  {
    id: '1',
    name: 'Vanilla Dream',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=400',
    description: 'A warm and comforting vanilla scent'
  },
  {
    id: '2',
    name: 'Lavender Mist',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1602874801007-bd36c376cd5d?auto=format&fit=crop&q=80&w=400',
    description: 'Calming lavender essence for relaxation'
  },
  {
    id: '3',
    name: 'Ocean Breeze',
    price: 27.99,
    image: 'https://images.unsplash.com/photo-1596433809252-901acb55fc63?auto=format&fit=crop&q=80&w=400',
    description: 'Fresh marine scent reminiscent of the sea'
  },
  {
    id: '4',
    name: 'Desert Rose',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1596433809252-901acb55fc63?auto=format&fit=crop&q=80&w=400',
    description: 'Exotic floral scent inspired by Arabian roses'
  }
];

const Shop = () => {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleAddToCart = (product: any) => {
    addToCart({ ...product, quantity: 1 });
    setSelectedProduct(product.name);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif mb-8 text-center">Our Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-medium mb-2">{product.name}</h2>
              <p className="text-stone-600 mb-2">${product.price}</p>
              <p className="text-sm text-stone-500 mb-4">{product.description}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      <AddToCartModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        productName={selectedProduct}
      />
    </div>
  );
};

export default Shop;