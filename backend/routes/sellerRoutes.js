import express from 'express';
import { createSeller, getSellers } from '../controllers/sellerController.js';

const router = express.Router();

router.route('/')
  .post(createSeller)
  .get(getSellers);

export default router;