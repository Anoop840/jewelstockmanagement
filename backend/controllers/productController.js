import Product from '../models/Product.js';

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

export const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.find({});
    
    let totalInVaultStock = 0;

    products.forEach((product) => {
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach((variant) => {
          // FIXED: Changed from variant.stock or variant.quantity to variant.stockInHouse
          totalInVaultStock += Number(variant.stockInHouse) || 0;
        });
      }
    });

    res.status(200).json({
      totalInVaultStock,
      activeSellers: 0,       // or your actual database counts
      totalOutstandingCredit: 0
    });

  } catch (error) {
    res.status(500).json({ message: "Error calculating metrics", error: error.message });
  }
};

export const getProducts = async (req, res) => {

  let totalStock = 0;
  products.forEach(product => {
    product.variants.forEach(variant => {
      // ⚠️ Check this property name carefully!
      totalStock += variant.stock || 0; 
    });
  });
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching products', error: error.message });
  }
};