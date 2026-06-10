import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';

dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 


app.use('/uploads', express.static('uploads'));

app.use('/api/products', productRoutes);
app.use('/api/sellers', sellerRoutes); // 2. Mount seller routes
app.use('/api/ledger', ledgerRoutes);

app.get('/', (req, res) => {
  res.send('Jewelry Stock Management API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});