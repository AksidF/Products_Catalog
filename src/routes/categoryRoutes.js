const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create Category
router.post('/', categoryController.createCategory);

// Update Category
router.put('/:id', categoryController.updateCategory);

// Delete Category
router.delete('/:id', categoryController.deleteCategory);

// Get All Categories
router.get('/all', categoryController.getAllCategories);

module.exports = router;