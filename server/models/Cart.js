import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Cart = mongoose.model('Cart', CartSchema);