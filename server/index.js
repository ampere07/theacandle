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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

app.use(cors({
  origin: ['https://reignco.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

app.use(express.json());

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

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

app.post('/api/products', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'additionalImages', maxCount: 5 }
]), async (req, res) => {
  try {
    const { name, price, description, collection } = req.body;

    const mainImage = req.files['image']?.[0]?.path;
    const additionalImages = req.files['additionalImages']?.map(file => file.path) || [];

    if (!mainImage) {
      return res.status(400).json({ error: 'Main image is required' });
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      collection,
      image: mainImage,
      additionalImages
    });

    await product.save();

    const populatedProduct = await Product.findById(product._id).populate('collection');
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.image) {
      try {
        const publicId = product.image
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting main image from Cloudinary:', cloudinaryError);
      }
    }

    for (const imageUrl of product.additionalImages) {
      try {
        const publicId = imageUrl
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting additional image from Cloudinary:', cloudinaryError);
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

app.post('/api/products/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, userName, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Add the new review
    product.reviews.push({
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date()
    });

    // Save the product with the new review
    await product.save();

    // Return the updated product with populated collection
    const updatedProduct = await Product.findById(productId).populate('collection');
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});