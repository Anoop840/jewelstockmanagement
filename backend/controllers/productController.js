import Product from '../models/Product.js';

<<<<<<< HEAD
=======
// @desc    Create a new product catalog item
// @route   POST /api/products
>>>>>>> 8ba7fcc72d2f3f230a8061448fcc36072d81ffbc
export const createProduct = async (req, res) => {
  try {
    const { itemCode, title, category, description, variants } = req.body;

    const productExists = await Product.findOne({ itemCode });
    if (productExists) {
      return res.status(400).json({ message: `Product code ${itemCode} already exists.` });
    }

    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    let parsedVariants = [];
    if (variants) {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    }

    const product = new Product({
      itemCode,
      title,
      category,
      description,
      images: imagePaths,
      variants: parsedVariants
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(500).json({ message: 'Server Error adding product', error: error.message });
  }
};

<<<<<<< HEAD
=======
// @desc    Calculate live aggregated counters for the metrics dashboard 
// @route   GET /api/products/stats
export const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.find({});
    
    let totalInVaultStock = 0;

    products.forEach((product) => {
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach((variant) => {
          totalInVaultStock += Number(variant.stockInHouse) || 0;
        });
      }
    });

    res.status(200).json({
      totalInVaultStock,
      activeSellers: 0,       
      totalOutstandingCredit: 0
    });

  } catch (error) {
    res.status(500).json({ message: "Error calculating metrics", error: error.message });
  }
};

// @desc    Fetch all stored catalog items for the Inventory Master sheet
// @route   GET /api/products
>>>>>>> 8ba7fcc72d2f3f230a8061448fcc36072d81ffbc
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching products', error: error.message });
  }
};