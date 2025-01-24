import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import AddToCartModal from '../components/AddToCartModal';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  collectionId: string;
}

interface Collection {
  _id: string;
  name: string;
  description: string;
}

const Shop = () => {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  const API_URL = 'https://theacandle.onrender.com';

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/collections`);
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    };
    addToCart(cartItem);
    setSelectedProduct(product.name);
    setModalOpen(true);
  };

  const filteredProducts = selectedCollection
    ? products.filter(product => product.collectionId === selectedCollection)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif mb-8 text-center">Our Collection</h1>
      
      {/* Collection Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setSelectedCollection('')}
            className={`px-4 py-2 rounded-md ${
              selectedCollection === ''
                ? 'bg-stone-800 text-white'
                : 'bg-white text-stone-800 border border-stone-200'
            }`}
          >
            All Collections
          </button>
          {collections.map((collection) => (
            <button
              key={collection._id}
              onClick={() => setSelectedCollection(collection._id)}
              className={`px-4 py-2 rounded-md ${
                selectedCollection === collection._id
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-800 border border-stone-200'
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
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
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