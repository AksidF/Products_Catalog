const multer = require('multer');
const path = require('path');
const { ProductAsset } = require('../models');

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Create Product Asset with image upload
exports.createProductAsset = upload.single('image'), async (req, res) => {
  console.log('Received request:', req.file);
  try {
    const { product_id } = req.body;

    // File information is available in req.file
    const image = req.file.filename;

    const productAsset = await ProductAsset.create({
      product_id,
      image,
    });

    res.status(201).json(productAsset);
  } catch (error) {
    console.error('Error creating product asset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Product Asset
exports.updateProductAsset = async (req, res) => {
  try {
    const productAssetId = req.params.id;
    const [updatedRowsCount, updatedProductAssets] = await ProductAsset.update(req.body, {
      where: { id: productAssetId },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'Product asset not found' });
    } else {
      res.status(200).json(updatedProductAssets[0]);
    }
  } catch (error) {
    console.error('Error updating product asset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Product Asset
exports.deleteProductAsset = async (req, res) => {
  try {
    const productAssetId = req.params.id;
    const deletedRowCount = await ProductAsset.destroy({
      where: { id: productAssetId },
    });

    if (deletedRowCount === 0) {
      res.status(404).json({ error: 'Product asset not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting product asset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get All Product Assets
exports.getAllProductAssets = async (req, res) => {
  try {
    const productAssets = await ProductAsset.findAll();
    res.status(200).json(productAssets);
  } catch (error) {
    console.error('Error retrieving product assets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};