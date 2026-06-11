import express from 'express';
import { loginAdmin,updatePassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.put('/update-password', updatePassword);

export default router;