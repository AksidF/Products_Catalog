const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Create Product
router.post('/', productController.createProduct);

// Get all Products with Categories and Assets
router.get('/all', productController.getAllProducts);

// Update Product
router.put('/:id', productController.updateProduct);

// Delete Product
router.delete('/:id', productController.deleteProduct);

module.exports = router;