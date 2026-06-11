import Seller from '../models/Seller.js';

// @desc    Add a new seller/agent
// @route   POST /api/sellers
// @access  Public
export const createSeller = async (req, res) => {
  try {
    const { name, phone, email, shopName } = req.body;

    // 1. Validation: Ensure name and phone are provided
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and Phone number are required.' });
    }

    // 2. Create and save the seller profile
    const seller = new Seller({
      name,
      phone,
      email,
      shopName
    });

    const savedSeller = await seller.save();
    res.status(201).json(savedSeller);

  } catch (error) {
    res.status(500).json({ message: 'Server Error adding seller', error: error.message });
  }
};

// @desc    Get all sellers with their pending status summary
// @route   GET /api/sellers
// @access  Public
export const getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({});
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching sellers', error: error.message });
  }
};