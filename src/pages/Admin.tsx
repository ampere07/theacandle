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
    image: null as File | null
  });

  const API_URL = 'https://theacandle.onrender.com';

  useEffect(() => {
    document.body.className = '';
    
    if (isAuthenticated) {
      fetchOrders();
      fetchCollections();
      fetchProducts();
    }

    return () => {
      document.body.className = '';
    };
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

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-white">
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-serif text-center mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-700"
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
    <div className="fixed inset-0 bg-white overflow-y-auto">
      <div className="min-h-screen bg-stone-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-serif">Admin Dashboard</h1>
              <button
                onClick={handleLogout}
                className="flex items-center text-stone-600 hover:text-stone-900"
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
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'orders' ? 'bg-stone-800 text-white' : 'bg-white text-stone-800'
              }`}
            >
              <Package className="w-5 h-5 mr-2" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'products' ? 'bg-stone-800 text-white' : 'bg-white text-stone-800'
              }`}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Products
            </button>
          </div>

          {activeTab === 'orders' ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="text-sm rounded-full px-3 py-1"
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Collections</h3>
                  <button
                    onClick={() => setIsAddingCollection(true)}
                    className="flex items-center bg-stone-800 text-white px-4 py-2 rounded-md hover:bg-stone-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Collection
                  </button>
                </div>

                {isAddingCollection && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium">Add New Collection</h4>
                        <button onClick={() => setIsAddingCollection(false)}>
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <form onSubmit={async (e) => {
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
                      }} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            required
                            value={newCollection.name}
                            onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={newCollection.description}
                            onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-700"
                        >
                          Add Collection
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collections.map((collection) => (
                    <div key={collection._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{collection.name}</h4>
                          <p className="text-sm text-gray-500">{collection.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCollection(collection._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Products</h3>
                  <button
                    onClick={() => setIsAddingProduct(true)}
                    className="flex items-center bg-stone-800 text-white px-4 py-2 rounded-md hover:bg-stone-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>

                {isAddingProduct && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium">Add New Product</h4>
                        <button onClick={() => setIsAddingProduct(false)}>
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newProduct.image) {
                          alert('Please select an image');
                          return;
                        }

                        const formData = new FormData();
                        formData.append('name', newProduct.name);
                        formData.append('price', newProduct.price);
                        formData.append('description', newProduct.description);
                        formData.append('collection', newProduct.collection);
                        formData.append('image', newProduct.image);

                        try {
                          await axios.post(`${API_URL}/api/products`, formData, {
                            headers: {
                              'Content-Type': 'multipart/form-data',
                            },
                          });
                          setNewProduct({
                            name: '',
                            price: '',
                            description: '',
                            collection: '',
                            image: null
                          });
                          setIsAddingProduct(false);
                          fetchProducts();
                        } catch (error) {
                          console.error('Error adding product:', error);
                          alert('Failed to add product');
                        }
                      }} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            required
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Price</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Collection</label>
                          <select
                            required
                            value={newProduct.collection}
                            onChange={(e) => setNewProduct({ ...newProduct, collection: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
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
                          <label className="block text-sm font-medium text-gray-700">Image</label>
                          <input
                            type="file"
                            required
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setNewProduct({ ...newProduct, image: file });
                            }}
                            className="mt-1 block w-full"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-700"
                        >
                          Add Product
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="border rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.description}</p>
                        <p className="text-sm font-medium mt-2">${product.price}</p>
                        <p className="text-xs text-gray-500 mt-1">
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
    </div>
  );
};

export default Admin;