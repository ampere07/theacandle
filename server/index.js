import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Order } from './models/Order.js';

dotenv.config();

const app = express();

// Update CORS to allow requests from your Vercel frontend
app.use(cors({
  origin: ['https://reignco.vercel.app/', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Reign Co API is running');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});