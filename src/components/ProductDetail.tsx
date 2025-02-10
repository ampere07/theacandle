import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AddToCartModal from './AddToCartModal';

interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

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
  additionalImages: string[];
  collection: Collection;
  rating: number;
  reviews: Review[];
}

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddReview: (productId: string, rating: number, comment: string) => Promise<void>;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onAddReview
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const allImages = [product.image, ...(product.additionalImages || [])];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      // Convert the product to match the CartItem interface
      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      };

      await addToCart(cartItem);
      setShowAddToCartModal(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddReview(product._id, rating, comment);
      setRating(0);
      setComment('');
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery Section */}
          <div className="p-6">
            <div className="relative h-[400px] overflow-hidden mb-4">
              <img
                src={allImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 flex-shrink-0 border overflow-hidden transition-all
                    ${currentImageIndex === index
                      ? 'border-black'
                      : 'opacity-70 hover:opacity-100'}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                <p className="text-xl font-medium text-gray-900">QAR {product.price.toLocaleString()}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    product.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-all disabled:bg-gray-400"
            >
              {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t">
          <div className="max-w-3xl mx-auto p-6">
            <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>

            {user && (
              <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-4">
                <h4 className="font-medium mb-3">Write a Review</h4>
                <div className="flex items-center gap-1.5 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 cursor-pointer hover:text-yellow-400 ${
                          rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                  </span>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full p-3 border mb-4 focus:ring-1 focus:ring-black focus:border-black"
                  rows={3}
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            <div className="space-y-6">
              {product.reviews?.map((review, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center gap-1.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          review.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    By {review.userName} · {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddToCartModal
        isOpen={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
        productName={product.name}
      />
    </>
  );
};

export default ProductDetail;