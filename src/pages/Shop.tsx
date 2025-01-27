import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import AddToCartModal from '../components/AddToCartModal';
import axios from 'axios';

const API_URL = 'https://theacandle.onrender.com';

const Shop = () => {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart({ ...product, quantity: 1 });
    setSelectedProduct(product.name);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif mb-8 text-center">Our Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={`${API_URL}${product.image}`}
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