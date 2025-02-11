import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't favorite the same product twice
favoriteSchema.index({ userEmail: 1, productId: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);