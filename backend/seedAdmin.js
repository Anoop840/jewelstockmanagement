import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';

dotenv.config();
connectDB();

const seed = async () => {
  try {
    // Clean up any existing admin users
    await Admin.deleteMany({ email: 'admin@jewelstock.com' });

    const initialAdmin = new Admin({
      name: 'Manager Administrator',
      email: 'admin@jewelstock.com',
      password: 'password123', 
    });

    await initialAdmin.save();
    console.log('Successfully created manager admin seed account!');
    process.exit();
  } catch (error) {
    console.error('Error seeding account:', error);
    process.exit(1);
  }
};

seed();