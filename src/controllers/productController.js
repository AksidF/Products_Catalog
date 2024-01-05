const slugify = require('slugify');
const { Product, Category, ProductAsset } = require('../models');

// Helper function to format price to IDR
const formatPriceToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
};

// Create Product
exports.createProduct = async (req, res) => {
    try {
      const { name, price } = req.body;
  
      // Automate the generation of the slug from the product name
      const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });
  
      const product = await Product.create({
        name,
        slug,
        price,
      });
  
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const [updatedRowsCount, updatedProducts] = await Product.update(req.body, {
      where: { id: productId },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json(updatedProducts[0]);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedRowCount = await Product.destroy({
      where: { id: productId },
    });

    if (deletedRowCount === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all Products with Categories and Assets
exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [
          { model: Category },
          { model: ProductAsset },
        ],
      });
  
      // Format prices to IDR for all products in-place
      products.forEach(product => {
        product.price = formatPriceToIDR(product.price);
      });
  
      res.status(200).json(products);
    } catch (error) {
      console.error('Error retrieving products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Optional: Get all Products with Categories and Assets, sorted by price
exports.getAllProductsSortedByPrice = async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [
          { model: Category },
          { model: ProductAsset },
        ],
        order: [['price', 'ASC']], // Change to DESC for descending order
      });
  
      // Format prices to IDR for all products in-place
      products.forEach(product => {
        product.price = formatPriceToIDR(product.price);
      });
  
      res.status(200).json(products);
    } catch (error) {
      console.error('Error retrieving products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};