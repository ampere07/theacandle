import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'meetup'],
    required: true
  },
  meetupLocation: {
    type: String,
    required: function() {
      return this.paymentMethod === 'meetup';
    }
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number
  }],
  deliveryFee: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Order = mongoose.model('Order', orderSchema);