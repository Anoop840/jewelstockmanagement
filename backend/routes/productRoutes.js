import express from 'express';
<<<<<<< HEAD
import { createProduct, getProducts } from '../controllers/productController.js';
import upload from '../middleware/upload.js';
=======
import { createProduct, getProducts, getDashboardStats } from '../controllers/productController.js';
import upload from '../middleware/upload.js';
import Seller from '../models/Seller.js';
>>>>>>> 8ba7fcc72d2f3f230a8061448fcc36072d81ffbc

const router = express.Router();

// Map routes
// upload.array('images', 5) allows up to 5 images to be uploaded simultaneously
router.route('/')
  .post(upload.array('images', 5), createProduct)
  .get(getProducts);

<<<<<<< HEAD
=======
router.get('/dashboard-stats', async (req, res) => {
  try {
    const products = await Product.find({});
    const sellers = await Seller.find({});

    // 1. Calculate total stock remaining in-house across all products and their variants
    let totalInHouse = 0;
    products.forEach(product => {
      product.variants.forEach(variant => {
        totalInHouse += variant.stockInHouse;
      });
    });

    // 2. Count total registered active sellers
    const totalSellers = sellers.length;

    // 3. Calculate total outstanding pieces currently out on credit custody
    let totalOutstanding = 0;
    sellers.forEach(seller => {
      totalOutstanding += (seller.outstandingPieces || 0);
    });

    res.status(200).json({
      totalInHouse,
      totalSellers,
      totalOutstanding
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error calculating dashboard stats', error: error.message });
  }
});

router.get('/stats', getDashboardStats);

>>>>>>> 8ba7fcc72d2f3f230a8061448fcc36072d81ffbc
export default router;