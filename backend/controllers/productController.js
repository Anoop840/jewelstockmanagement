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

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching products', error: error.message });
  }
};