import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AddToCartModal from '../components/AddToCartModal';
import axios from 'axios';

const API_URL = 'https://theacandle.onrender.com';

// Configure axios defaults
axios.defaults.withCredentials = true;

interface Collection {
  _id: string;
  name: string;
  description: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  collection: Collection;
}

const Shop = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, collectionsRes] = await Promise.all([
          axios.get(`${API_URL}/api/products`, { withCredentials: true }),
          axios.get(`${API_URL}/api/collections`, { withCredentials: true })
        ]);
        setProducts(productsRes.data);
        setCollections(collectionsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Add better error handling
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          console.error('CORS error - check server configuration');
        }
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!user?.email) {
      // Handle not logged in state - you might want to show a login prompt
      alert('Please log in to add items to cart');
      return;
    }

    try {
      setIsAddingToCart(true);
      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      };
      
      await addToCart(cartItem);
      setSelectedProduct(product.name);
      setModalOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const filteredProducts = selectedCollection === 'all'
    ? products
    : products.filter(product => product.collection?._id === selectedCollection);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-12 text-center text-stone-800">Our Collection</h1>
      
      {/* Collection Filter */}
      <div className="mb-12 flex justify-center">
        <div className="inline-flex rounded-none shadow-sm" role="group">
          <button
            key="all"
            onClick={() => setSelectedCollection('all')}
            className={`px-6 py-2.5 text-sm font-light tracking-wider border ${
              selectedCollection === 'all'
                ? 'bg-stone-800 text-beige-50 border-stone-800'
                : 'bg-beige-50 text-stone-700 border-stone-300 hover:bg-beige-100'
            }`}
          >
            All Collections
          </button>
          {collections.map((collection) => (
            <button
              key={collection._id}
              onClick={() => setSelectedCollection(collection._id)}
              className={`px-6 py-2.5 text-sm font-light tracking-wider border-t border-b border-r ${
                selectedCollection === collection._id
                  ? 'bg-stone-800 text-beige-50 border-stone-800'
                  : 'bg-beige-50 text-stone-700 border-stone-300 hover:bg-beige-100'
              }`}
            >
              {collection.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-none shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-64">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className="bg-stone-800 text-beige-50 text-xs px-3 py-1.5 font-light tracking-wider">
                  {product.collection?.name}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-sans-serif mb-2 text-stone-800">{product.name}</h2>
              <p className="text-stone-600 mb-2 font-light">QAR{product.price}</p>
              <p className="text-sm text-stone-500 mb-6 font-light">{product.description}</p>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={isAddingToCart}
                className={`w-full bg-black text-white py-2.5 px-4 rounded-none hover:bg-gray-500 transition-colors font-light tracking-wider ${
                  isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-stone-500 font-light">No products found in this collection.</p>
        </div>
      )}

      <AddToCartModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        productName={selectedProduct}
      />
    </div>
  );
};

export default Shop;