const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Create Product
router.post('/', productController.createProduct);

// Get all Products with Categories and Assets
router.get('/', productController.getAllProducts);

// Update Product
router.put('/:id', productController.updateProduct);

// Delete Product
router.delete('/:id', productController.deleteProduct);

// Get all Products with Categories and Assets, sorted by price
router.get('/sorted-by-price', productController.getAllProductsSortedByPrice);

module.exports = router;