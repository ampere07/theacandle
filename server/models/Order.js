import mongoose from 'mongoose';
const moment = require('moment-timezone');
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'meetup'],
    required: true
  },
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: () => moment.tz('Asia/Qatar').toDate()
  }
});

export const Order = mongoose.model('Order', orderSchema);