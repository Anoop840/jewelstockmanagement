import mongoose from 'mongoose';

// Define the variant sub-schema (for tracking different colors of the same item)
const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true, // e.g., "Yellow Gold", "Rose Gold", "White Gold"
  },
  sku: {
    type: String,
    required: true,
    unique: true,   // e.g., "GG101-GOLD", "GG101-ROSE"
  },
  stockInHouse: {
    type: Number,
    required: true,
    default: 0,     // Total pieces currently available in the main store
  },
  details: {
    type: String,   // Any specific notes for this color variation
    default: '',
  }
});

// Define the Master Product Schema
const productSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
    unique: true,   // e.g., "GG101"
    trim: true
  },
  title: {
    type: String,
    required: true, // e.g., "Classic Diamond Ring"
    trim: true
  },
  category: {
    type: String,
    required: true, // e.g., "Ring", "Necklace", "Bangle"
  },
  images: [
    {
      type: String, // Array of image URLs/paths stored on the server
    }
  ],
  // Embedding the variants array directly inside the product
  variants: [variantSchema], 
  
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const Product = mongoose.model('Product', productSchema);

export default Product;