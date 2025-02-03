import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Order } from './models/Order.js';
import { Collection } from './models/Collection.js';
import { Product } from './models/Product.js';
import { Cart } from './models/Cart.js';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

app.use(cors({
  origin: ['https://reignco.vercel.app', 'http://localhost:5173'], // Add your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

app.use(express.json());

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

const upload = multer({ storage: storage });

// GET routes for fetching data
app.get('/api/collections', async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('collection');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new POST route for creating products
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, collection } = req.body;
    
    const product = new Product({
      name,
      price: Number(price),
      description,
      collection,
      image: req.file ? req.file.path : null // Cloudinary URL is stored directly
    });

    await product.save();
    
    const populatedProduct = await Product.findById(product._id).populate('collection');
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete routes for products and collections
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the image from Cloudinary if it exists
    if (product.image) {
      try {
        // Extract public ID from the Cloudinary URL
        const publicId = product.image
          .split('/')
          .slice(-2) // Get the last two segments (folder and filename)
          .join('/') // Join them back together
          .split('.')[0]; // Remove the file extension

        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with product deletion even if image deletion fails
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/collections/:id', async (req, res) => {
  try {
    const products = await Product.find({ collection: req.params.id });
    if (products.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete collection with existing products. Please delete or move the products first.' 
      });
    }

    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cart/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const cart = await Cart.findOne({ userEmail })
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'name price image'
      });
    
    if (!cart) {
      return res.json({ items: [] });
    }

    const formattedItems = cart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity
    }));

    res.json({ items: formattedItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart/:userEmail/add', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ userEmail });
    
    if (!cart) {
      cart = new Cart({ userEmail, items: [] });
    }

    const existingItem = cart.items.find(item => 
      item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      model: 'Product',
      select: 'name price image'
    });

    const formattedItems = updatedCart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity
    }));

    res.json({ items: formattedItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart/:userEmail/update', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userEmail });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (quantity < 1) {
      cart.items = cart.items.filter(item => 
        item.productId.toString() !== productId
      );
    } else {
      const item = cart.items.find(item => 
        item.productId.toString() === productId
      );
      if (item) {
        item.quantity = quantity;
      }
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      model: 'Product',
      select: 'name price image'
    });

    const formattedItems = updatedCart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity
    }));

    res.json({ items: formattedItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart/:userEmail/clear', async (req, res) => {
  try {
    const { userEmail } = req.params;
    await Cart.findOneAndUpdate(
      { userEmail },
      { $set: { items: [], updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});