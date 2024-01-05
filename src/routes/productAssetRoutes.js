const express = require('express');
const router = express.Router();
const productAssetController = require('../controllers/productAssetController');

// Create Product Asset with image upload
router.post('/', productAssetController.createProductAsset);

// Update Product Asset
router.put('/:id', productAssetController.updateProductAsset);

// Delete Product Asset
router.delete('/:id', productAssetController.deleteProductAsset);

// Get All Product Assets
router.get('/', productAssetController.getAllProductAssets);

module.exports = router;