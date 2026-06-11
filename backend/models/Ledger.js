import mongoose from 'mongoose';

// Track individual items involved in this specific handover/reconciliation
const ledgerItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantSku: {
    type: String, // e.g., "GG101-GOLD"
    required: true
  },
  quantityIssued: {
    type: Number,
    required: true, // The initial quantity handed over (e.g., 12 pieces)
  },
  quantitySold: {
    type: Number,
    default: 0,     // Updated during audit (e.g., 6 pieces)
  },
  quantityReturned: {
    type: Number,
    default: 0,     // Updated during audit (e.g., 1 piece)
  },
  quantityPending: {
    type: Number,
    required: true, // Leftover pieces with seller (Initially matches quantityIssued, drops to 5 after audit)
  }
});

// The Master Ledger Schema
const ledgerSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  items: [ledgerItemSchema], // An array because a manager can give multiple types of items in one go
  
  status: {
    type: String,
    enum: ['Pending', 'Partially Settled', 'Fully Settled'],
    default: 'Pending'
  },
  notes: {
    type: String,
    default: '' // Any specific remarks (e.g., "Handed over for upcoming festival sales")
  }
}, {
  timestamps: true // Tracks exactly when the stock handover took place
});

const Ledger = mongoose.model('Ledger', ledgerSchema);

export default Ledger;