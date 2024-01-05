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
    const { name, price, CategoryId } = req.body;

    // Check if the provided CategoryId is valid
    if (CategoryId !== undefined && (await Category.findByPk(CategoryId)) === null) {
      return res.status(400).json({ error: 'Invalid CategoryId. Category not found.' });
    }

    // Automate the generation of the slug from the product name
    const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });

    const product = await Product.create({
      name,
      slug,
      price,
      CategoryId,
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
    const ProductId = req.params.id;
    const updatedProductData = req.body;

    // Check if the provided CategoryId is valid
    if (updatedProductData.CategoryId !== undefined && (await Category.findByPk(updatedProductData.CategoryId)) === null) {
      return res.status(400).json({ error: 'Invalid CategoryId. Category not found.' });
    }

    // Update the product
    const [, updatedProducts] = await Product.update(updatedProductData, {
      where: { id: ProductId },
      returning: true,
    });

    const updatedData = await Product.findByPk(ProductId);
    if (updatedProducts.length === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json(updatedData);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const ProductId = req.params.id;
    const deletedRowCount = await Product.destroy({
      where: { id: ProductId },
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
    // Define the default sorting order
    const defaultSortOrder = 'asc';

    // Extract the sorting parameter from the request query, default to 'asc'
    const sortOrder = req.query.sortOrder || defaultSortOrder;

    // Validate the sortOrder to be 'asc' or 'desc'
    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) {
      return res.status(400).json({ error: 'Invalid sortOrder parameter. Use "asc" or "desc".' });
    }

    // Define the sorting options based on the price attribute
    const sortingOptions = [['price', sortOrder]];

    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: ProductAsset },
      ],
      order: sortingOptions,
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
