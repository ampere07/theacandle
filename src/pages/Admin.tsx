import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingBag, LogOut, Plus, X, Trash2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Order {
  _id: string;
  name: string;
  address: string;
  status: string;
  total: number;
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
  image: string;
  additionalImages: string[];
  description: string;
  collection: Collection;
}

const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    collection: '',
    image: null as File | null,
    additionalImages: [] as File[]
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

  const API_URL = 'https://theacandle.onrender.com';

  useEffect(() => {
    if (isAddingProduct || isAddingCollection) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddingProduct, isAddingCollection]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchCollections();
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
    navigate('/');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/api/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await axios.delete(`${API_URL}/api/collections/${collectionId}`);
        fetchCollections();
      } catch (error) {
        console.error('Error deleting collection:', error);
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert('Failed to delete collection');
        }
      }
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewProduct({ ...newProduct, additionalImages: files });

    // Create preview URLs for all additional images
    const previews = files.map(file => URL.createObjectURL(file));
    setAdditionalImagePreviews(previews);
  };

  const removeAdditionalImage = (index: number) => {
    const updatedImages = [...newProduct.additionalImages];
    updatedImages.splice(index, 1);
    setNewProduct({ ...newProduct, additionalImages: updatedImages });

    const updatedPreviews = [...additionalImagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]); // Clean up the old preview URL
    updatedPreviews.splice(index, 1);
    setAdditionalImagePreviews(updatedPreviews);
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      price: '',
      description: '',
      collection: '',
      image: null,
      additionalImages: []
    });
    setImagePreview(null);
    setAdditionalImagePreviews([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-beige-50">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white p-8">
            <h2 className="text-2xl font-serif text-center mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-light text-stone-700">Username</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="mt-1 block w-full border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-stone-700">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="mt-1 block w-full border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-stone-800 text-white py-2 px-4 hover:bg-stone-700 transition-colors font-light tracking-wider"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-serif">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center text-stone-600 hover:text-stone-900 font-light tracking-wider"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center px-4 py-2 font-light tracking-wider ${
              activeTab === 'orders'
                ? 'bg-stone-800 text-white'
                : 'bg-white text-stone-800 hover:bg-stone-100'
            }`}
          >
            <Package className="w-5 h-5 mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center px-4 py-2 font-light tracking-wider ${
              activeTab === 'products'
                ? 'bg-stone-800 text-white'
                : 'bg-white text-stone-800 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Products
          </button>
        </div>

        {activeTab === 'orders' ? (
          <div className="bg-white overflow-hidden">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-light text-stone-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-stone-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-stone-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-stone-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-stone-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-stone-900">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-stone-900">
                      {order.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="text-sm px-3 py-1 font-light border-stone-300"
                        value={order.status}
                        onChange={async (e) => {
                          try {
                            await axios.patch(`${API_URL}/api/orders/${order._id}`, {
                              status: e.target.value
                            });
                            fetchOrders();
                          } catch (error) {
                            console.error('Error updating order:', error);
                          }
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-stone-900">
                      QAR{order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-stone-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-serif">Collections</h3>
                <button
                  onClick={() => setIsAddingCollection(true)}
                  className="flex items-center bg-stone-800 text-white px-4 py-2 hover:bg-stone-700 transition-colors font-light tracking-wider"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Collection
                </button>
              </div>

              {isAddingCollection && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
                  <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative bg-white p-6 max-w-md w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-serif">Add New Collection</h4>
                        <button
                          onClick={() => setIsAddingCollection(false)}
                          className="text-stone-400 hover:text-stone-500 transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            await axios.post(`${API_URL}/api/collections`, newCollection);
                            setNewCollection({ name: '', description: '' });
                            setIsAddingCollection(false);
                            fetchCollections();
                          } catch (error) {
                            console.error('Error adding collection:', error);
                            alert('Failed to add collection');
                          }
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-light text-stone-700">Name</label>
                          <input
                            type="text"
                            required
                            value={newCollection.name}
                            onChange={(e) =>
                              setNewCollection({ ...newCollection, name: e.target.value })
                            }
                            className="mt-1 block w-full border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-light text-stone-700">
                            Description
                          </label>
                          <textarea
                            value={newCollection.description}
                            onChange={(e) =>
                              setNewCollection({ ...newCollection, description: e.target.value })
                            }
                            className="mt-1 block w-full border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-stone-800 text-white py-2 px-4 hover:bg-stone-700 transition-colors font-light tracking-wider"
                        >
                          Add Collection
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((collection) => (
                  <div key={collection._id} className="border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif">{collection.name}</h4>
                        <p className="text-sm text-stone-500 font-light">
                          {collection.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteCollection(collection._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-serif">Products</h3>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center bg-stone-800 text-white px-4 py-2 hover:bg-stone-700 transition-colors font-light tracking-wider"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              </div>

              {isAddingProduct && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
                  <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative bg-white p-6 max-w-md w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-serif">Add New Product</h4>
                        <button
                          onClick={() => {
                            setIsAddingProduct(false);
                            resetProductForm();
                          }}
                          className="text-stone-400 hover:text-stone-500 transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!newProduct.image) {
                            alert('Please select a main product image');
                            return;
                          }

                          const formData = new FormData();
                          formData.append('name', newProduct.name);
                          formData.append('price', newProduct.price);
                          formData.append('description', newProduct.description);
                          formData.append('collection', newProduct.collection);
                          formData.append('image', newProduct.image);

                          newProduct.additionalImages.forEach((image) => {
                            formData.append('additionalImages', image);
                          });

                          try {
                            await axios.post(`${API_URL}/api/products`, formData, {
                              headers: {
                                'Content-Type': 'multipart/form-data'
                              }
                            });
                            resetProductForm();
                            setIsAddingProduct(false);
                            fetchProducts();
                          } catch (error) {
                            console.error('Error adding product:', error);
                            alert('Failed to add product');
                          }
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-light text-stone-700">
                            Product Name
                          </label>
                          <input
                            type="text"
                            required
                            value={newProduct.name}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, name: e.target.value })
                            }
                            className="mt-1 block w-full border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                            placeholder="Enter product name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-light text-stone-700">
                            Price (QAR)
                          </label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, price: e.target.value })
                            }
                            className="mt-1 block w-full border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-light text-stone-700">
                            Description
                          </label>
                          <textarea
                            required
                            value={newProduct.description}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, description: e.target.value })
                            }
                            className="mt-1 block w-full border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 h-32"
                            placeholder="Enter product description"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-light text-stone-700">
                            Collection
                          </label>
                          <select
                            required
                            value={newProduct.collection}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, collection: e.target.value })
                            }
                            className="mt-1 block w-full border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                          >
                            <option value="">Select a collection</option>
                            {collections.map((collection) => (
                              <option key={collection._id} value={collection._id}>
                                {collection.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Main Image Upload */}
                        <div>
                          <label className="block text-sm font-light text-stone-700">
                            Main Product Image
                          </label>
                          <div className="mt-1 flex items-center gap-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMainImageChange}
                              className="hidden"
                              id="mainImage"
                              required
                            />
                            <label
                              htmlFor="mainImage"
                              className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-stone-300 hover:border-stone-400 cursor-pointer transition-colors"
                            >
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Main preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center">
                                  <ImageIcon className="w-8 h-8 mx-auto text-stone-400" />
                                  <span className="text-sm text-stone-500">Main Image</span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Additional Images Upload */}
                        <div>
                          <label className="block text-sm font-light text-stone-700">
                            Additional Images (Gallery)
                          </label>
                          <div className="mt-1">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleAdditionalImagesChange}
                              className="hidden"
                              id="additionalImages"
                            />
                            <label
                              htmlFor="additionalImages"
                              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-stone-300 hover:border-stone-400 cursor-pointer transition-colors"
                            >
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 mx-auto text-stone-400" />
                                <span className="text-sm text-stone-500">Add Gallery Images</span>
                              </div>
                            </label>
                          </div>

                          {/* Additional Images Preview */}
                          {additionalImagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-2">
                              {additionalImagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeAdditionalImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 hover:bg-red-600 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-stone-800 text-white py-2 px-4 hover:bg-stone-700 transition-colors font-light tracking-wider"
                        >
                          Add Product
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-0">
                {products.map((product) => (
                  <div key={product._id} className="border overflow-hidden">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif">{product.name}</h4>
                      <p className="text-sm text-stone-500 font-light">{product.description}</p>
                      <p className="text-sm font-light mt-2">QAR{product.price}</p>
                      <p className="text-xs text-stone-500 mt-1 font-light">
                        Collection: {product.collection?.name}
                      </p>
                      {product.additionalImages && product.additionalImages.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-stone-500 font-light mb-1">
                            Gallery Images: {product.additionalImages.length}
                          </p>
                          <div className="flex gap-2 overflow-x-auto">
                            {product.additionalImages.map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt={`${product.name} gallery ${index + 1}`}
                                className="w-12 h-12 object-cover border"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;