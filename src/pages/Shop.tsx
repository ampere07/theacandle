import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ArrowLeft, Heart } from 'lucide-react';
import AddToCartModal from '../components/AddToCartModal';
import ProductDetail from '../components/ProductDetail';
import axios from 'axios';

const API_URL = 'https://theacandle.onrender.com';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';

interface Collection {
  _id: string;
  name: string;
  description: string;
}

interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  additionalImages: string[];
  collection: Collection;
  rating: number;
  reviews: Review[];
}

interface FavoriteProduct {
  _id: string;
  userEmail: string;
  productId: string;
}

const Shop = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [productsRes, collectionsRes] = await Promise.all([
          axios.get(`${API_URL}/api/products`),
          axios.get(`${API_URL}/api/collections`)
        ]);

        setProducts(productsRes.data);
        setCollections(collectionsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.email) return;

      try {
        const response = await axios.get(`${API_URL}/api/favorites/${user.email}`);
        const favoriteIds = response.data.map((fav: { productId: Product }) => fav.productId._id);
        setFavorites(favoriteIds);
        setFavoriteCount(favoriteIds.length);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user?.email]);

  const handleAddToCart = async (product: Product) => {
    if (!user?.email) {
      setError('Please log in to add items to cart');
      return;
    }

    try {
      setIsAddingToCart(true);
      setError(null);

      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      };

      await addToCart(cartItem);
      setModalOpen(true);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddReview = async (productId: string, rating: number, comment: string) => {
    if (!user) {
      setError('Please log in to add a review');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/products/${productId}/reviews`,
        {
          rating,
          comment,
          userId: user.email,
          userName: user.email.split('@')[0]
        }
      );

      const updatedProducts = products.map(p =>
        p._id === productId ? response.data : p
      );
      setProducts(updatedProducts);

      if (selectedProduct?._id === productId) {
        setSelectedProduct(response.data);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  // Filter products based on favorites and collection
  const filteredProducts = showFavorites
    ? products.filter(product => favorites.includes(product._id))
    : selectedCollection === 'all'
    ? products
    : products.filter(product => product.collection?._id === selectedCollection);

  if (selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => setSelectedProduct(null)}
          className="flex items-center text-stone-600 hover:text-stone-900 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="font-light tracking-wider">Back to Products</span>
        </button>

        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddReview={handleAddReview}
        />

        <AddToCartModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          productName={selectedProduct?.name || ''}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-12 text-center text-stone-800">Our Collection</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="mb-12 flex justify-center flex-wrap gap-4">
            <div className="inline-flex rounded-none shadow-sm" role="group">
              <button
                key="all"
                onClick={() => {
                  setSelectedCollection('all');
                  setShowFavorites(false);
                }}
                className={`px-6 py-2.5 text-sm font-light tracking-wider border ${
                  selectedCollection === 'all' && !showFavorites
                    ? 'bg-stone-800 text-beige-50 border-stone-800'
                    : 'bg-beige-50 text-stone-700 border-stone-300 hover:bg-beige-100'
                }`}
              >
                All Collections
              </button>
              {collections.map((collection) => (
                <button
                  key={collection._id}
                  onClick={() => {
                    setSelectedCollection(collection._id);
                    setShowFavorites(false);
                  }}
                  className={`px-6 py-2.5 text-sm font-light tracking-wider border-t border-b border-r ${
                    selectedCollection === collection._id && !showFavorites
                      ? 'bg-stone-800 text-beige-50 border-stone-800'
                      : 'bg-beige-50 text-stone-700 border-stone-300 hover:bg-beige-100'
                  }`}
                >
                  {collection.name}
                </button>
              ))}
            </div>

            {user && (
              <button
                onClick={() => {
                  setShowFavorites(!showFavorites);
                  setSelectedCollection('all');
                }}
                className={`px-6 py-2.5 text-sm font-light tracking-wider border flex items-center gap-2 ${
                  showFavorites
                    ? 'bg-stone-800 text-beige-50 border-stone-800'
                    : 'bg-beige-50 text-stone-700 border-stone-300 hover:bg-beige-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
                Favorites ({favoriteCount})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-none shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
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
                  <div className="flex items-center gap-1.5 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          product.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-stone-500 ml-1 font-light">
                      {product.rating > 0
                        ? `${product.rating.toFixed(1)} (${product.reviews?.length || 0})`
                        : 'No reviews yet'}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500 mb-6 font-light line-clamp-2">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;