import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingBag, LogOut, FolderPlus, Plus } from 'lucide-react';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    collection: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showCollectionForm, setShowCollectionForm] = useState(false);

  const API_URL = 'https://theacandle.onrender.com';

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/collections`, newCollection);
      setNewCollection({ name: '', description: '' });
      setShowCollectionForm(false);
      fetchCollections();
    } catch (error) {
      console.error('Error adding collection:', error);
      alert('Failed to add collection. Please try again.');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('collection', newProduct.collection);
    formData.append('image', selectedImage);

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
        collection: ''
      });
      setSelectedImage(null);
      setPreviewUrl('');
      setSelectedCollection(null);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
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
  };

  if (!isAuthenticated) {
    return (
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
    );
  }

  return (
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
            {/* Collections Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Collections</h3>
                <button
                  onClick={() => setShowCollectionForm(!showCollectionForm)}
                  className="flex items-center bg-stone-800 text-white px-4 py-2 rounded-md hover:bg-stone-700"
                >
                  <FolderPlus className="w-5 h-5 mr-2" />
                  {showCollectionForm ? 'Cancel' : 'Add Collection'}
                </button>
              </div>
              
              {showCollectionForm && (
                <form onSubmit={handleAddCollection} className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Collection Name</label>
                    <input
                      type="text"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={newCollection.description}
                      onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-stone-800 text-white px-4 py-2 rounded-md hover:bg-stone-700"
                  >
                    Create Collection
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <div
                    key={collection._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium mb-2">{collection.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{collection.description}</p>
                    <button
                      onClick={() => setSelectedCollection(collection._id)}
                      className="text-stone-600 hover:text-stone-900"
                    >
                      Manage Products
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Section */}
            {selectedCollection && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Products in {collections.find(c => c._id === selectedCollection)?.name}</h3>
                  <button
                    onClick={() => setSelectedCollection(null)}
                    className="text-stone-600 hover:text-stone-900"
                  >
                    Back to Collections
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value, collection: selectedCollection })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-stone-50 file:text-stone-700
                        hover:file:bg-stone-100"
                      required
                    />
                    {previewUrl && (
                      <div className="mt-2">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-stone-800 text-white px-4 py-2 rounded-md hover:bg-stone-700"
                  >
                    Add Product
                  </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products
                    .filter(product => product.collection._id === selectedCollection)
                    .map((product) => (
                      <div key={product._id} className="border rounded-lg overflow-hidden">
                        <img
                          src={`${API_URL}${product.image}`}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-medium mb-2">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <p className="font-medium">${product.price}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;