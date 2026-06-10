import express from 'express';
import { createProduct, getProducts } from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Map routes
// upload.array('images', 5) allows up to 5 images to be uploaded simultaneously
router.route('/')
  .post(upload.array('images', 5), createProduct)
  .get(getProducts);

export default router;