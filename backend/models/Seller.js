import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // e.g., "Seller A"
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  shopName: {
    type: String,
    trim: true,
    default: '' // Optional: If they own an external boutique/store
  },
  // High-level summary fields for quick dashboard metrics
  outstandingPieces: {
    type: Number,
    default: 0, // Total items currently physical sitting with this seller
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Tracks when the seller was added or updated
});

const Seller = mongoose.model('Seller', sellerSchema);

export default Seller;