import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
<<<<<<< HEAD
=======
import authRoutes from './routes/authRoutes.js';
>>>>>>> 8ba7fcc72d2f3f230a8061448fcc36072d81ffbc

dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 


app.use('/uploads', express.static('uploads'));

app.use('/api/products', productRoutes);
<<<<<<< HEAD
app.use('/api/sellers', sellerRoutes); // 2. Mount seller routes
app.use('/api/ledger', ledgerRoutes);
=======
app.use('/api/sellers', sellerRoutes); 
app.use('/api/ledger', ledgerRoutes);
app.use('/api/auth', authRoutes);
>>>>>>> 8ba7fcc72d2f3f230a8061448fcc36072d81ffbc

app.get('/', (req, res) => {
  res.send('Jewelry Stock Management API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});