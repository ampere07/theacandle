import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingBag, LogOut, Plus, X, Trash2 } from 'lucide-react';
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
//asdasd
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-beige-50">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-none shadow-md p-8">
            <h2 className="text-2xl font-serif text-center mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-light text-stone-700">Username</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="mt-1 block w-full rounded-none border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-stone-700">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="mt-1 block w-full rounded-none border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-stone-800 text-white py-2 px-4 rounded-none hover:bg-stone-700 transition-colors font-light tracking-wider"
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
      <div className="bg-white shadow">
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
            className={`flex items-center px-4 py-2 rounded-none font-light tracking-wider ${
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
            className={`flex items-center px-4 py-2 rounded-none font-light tracking-wider ${
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
          <div className="bg-white rounded-none shadow overflow-hidden">
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
                        className="text-sm rounded-none px-3 py-1 font-light border-stone-300"
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
            <div className="bg-white rounded-none shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-serif">Collections</h3>
                <button
                  onClick={() => setIsAddingCollection(true)}
                  className="flex items-center bg-stone-800 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition-colors font-light tracking-wider"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Collection
                </button>
              </div>

              {isAddingCollection && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
                  <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative bg-white rounded-none p-6 max-w-md w-full">
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
                            className="mt-1 block w-full rounded-none border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
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
                            className="mt-1 block w-full rounded-none border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-stone-800 text-white py-2 px-4 rounded-full hover:bg-stone-700 transition-colors font-light tracking-wider"
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
                  <div key={collection._id} className="border rounded-none p-4">
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

            <div className="bg-white rounded-none shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-serif">Products</h3>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center bg-stone-800 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition-colors font-light tracking-wider"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              </div>

              {isAddingProduct && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
                  <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative bg-white rounded-none p-6 max-w-md w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-serif">Add New Product</h4>
                        <button
                          onClick={() => setIsAddingProduct(false)}
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
                            setNewProduct({
                              name: '',
                              price: '',
                              description: '',
                              collection: '',
                              image: null,
                              additionalImages: []
                            });
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
                            className="mt-1 block w-full rounded-none border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
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
                            className="mt-1 block w-full rounded-none border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
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
                            className="mt-1 block w-full rounded-none border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 h-32"
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
                            className="mt-1 block w-full rounded-none border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                          >
                            <option value="">Select a collection</option>
                            {collections.map((collection) => (
                              <option key={collection._id} value={collection._id}>
                                {collection.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-light text-stone-700">
                            Main Product Image
                          </label>
                          <input
                            type="file"
                            required
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setNewProduct({ ...newProduct, image: file });
                            }}
                            className="mt-1 block w-full font-light"
                          />
                          {newProduct.image && (
                            <div className="mt-2">
                              <img
                                src={URL.createObjectURL(newProduct.image)}
                                alt="Product preview"
                                className="h-32 w-32 object-cover rounded-none border"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-light text-stone-700">
                            Additional Images (Sliding Gallery)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              setNewProduct({ ...newProduct, additionalImages: files });
                            }}
                            className="mt-1 block w-full font-light"
                          />
                          {newProduct.additionalImages.length > 0 && (
                            <div className="mt-2 flex gap-2 overflow-x-auto">
                              {newProduct.additionalImages.map((image, index) => (
                                <img
                                  key={index}
                                  src={URL.createObjectURL(image)}
                                  alt={`Additional image ${index + 1}`}
                                  className="h-24 w-24 object-cover rounded-none border"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-stone-800 text-white py-2 px-4 rounded-full hover:bg-stone-700 transition-colors font-light tracking-wider"
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
                  <div key={product._id} className="border rounded-none overflow-hidden">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-none hover:bg-red-700 transition-colors"
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