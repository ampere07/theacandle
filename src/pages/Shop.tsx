import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import AddToCartModal from '../components/AddToCartModal';
import axios from 'axios';

const API_URL = 'https://theacandle.onrender.com';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, collectionsRes] = await Promise.all([
          axios.get(`${API_URL}/api/products`),
          axios.get(`${API_URL}/api/collections`)
        ]);
        setProducts(productsRes.data);
        setCollections(collectionsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };
    
    addToCart(cartItem);
    setSelectedProduct(product.name);
    setModalOpen(true);
  };

  const filteredProducts = selectedCollection === 'all'
    ? products
    : products.filter(product => product.collection?._id === selectedCollection);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif mb-8 text-center">Our Collection</h1>
      
      {/* Collection Filter */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            key="all"
            onClick={() => setSelectedCollection('all')}
            className={`px-4 py-2 text-sm font-medium border ${
              selectedCollection === 'all'
                ? 'bg-stone-800 text-white border-stone-800'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            } ${
              'rounded-l-lg'
            }`}
          >
            All Collections
          </button>
          {collections.map((collection, index) => (
            <button
              key={collection._id}
              onClick={() => setSelectedCollection(collection._id)}
              className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
                selectedCollection === collection._id
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              } ${
                index === collections.length - 1 ? 'rounded-r-lg' : ''
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
            <div className="relative h-64">
              <img
                src={product.image} // Use the Cloudinary URL directly
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="bg-stone-800 text-white text-xs px-2 py-1 rounded-full">
                  {product.collection?.name}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-medium mb-2">{product.name}</h2>
              <p className="text-stone-600 mb-2">${product.price}</p>
              <p className="text-sm text-stone-500 mb-4">{product.description}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-stone-500">No products found in this collection.</p>
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