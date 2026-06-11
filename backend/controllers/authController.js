import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper function to sign the token using a secret key
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
    expiresIn: '30d', // Pass key remains valid for 30 days
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find Admin by Email
    const admin = await Admin.findOne({ email });

    // 2. Validate and verify match password method
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password credentials.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during auth logic', error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { adminId, currentPassword, newPassword } = req.body;

    // 1. Find the admin profile
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Administrator account not found.' });
    }

    // 2. Verify current password match
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password mismatch. Authorization denied.' });
    }

    // 3. Set the new password (our pre-save hook in Admin.js will automatically hash this)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating password', error: error.message });
  }
};