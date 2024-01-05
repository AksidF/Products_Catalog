const fs = require('fs/promises');
const path = require('path');
const { Product, ProductAsset } = require('../models');


// Create Product Asset with image upload
exports.createProductAsset = async (req, res) => {
  try {
    const { ProductId } = req.body;

    // Check if the ProductId is valid
    const existingProduct = await Product.findByPk(ProductId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'ProductId not found' });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const image = req.files.image;
    const fileName = `${Date.now()}-${image.name}`;

    // Move the file to the desired destination
    image.mv(`public/images/${fileName}`, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Create the ProductAsset record in the database
      ProductAsset.create({
        ProductId,
        image: fileName,
      })
        .then((productAsset) => {
          res.status(201).json(productAsset);
        })
        .catch((error) => {
          console.error('Error creating product asset:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    });
  } catch (error) {
    console.error('Error creating product asset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Product Asset with image upload
exports.updateProductAsset = async (req, res) => {
  try {
    const productAssetId = req.params.id;
    const existingProductAsset = await ProductAsset.findByPk(productAssetId);

    if (!existingProductAsset) {
      return res.status(404).json({ error: 'Product asset not found' });
    }

    const { ProductId } = req.body;

    // Check if the ProductId is valid
    if (ProductId) {
      const existingProduct = await Product.findByPk(ProductId);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
    }

    // Check if there's a file in the request
    if (req.files && req.files.image) {
      const image = req.files.image;
      const fileName = `${Date.now()}-${image.name}`;

      
      await image.mv(`public/images/${fileName}`);
      
      // Delete the existing image file
      const imagePath = path.join('public/images', existingProductAsset.image);
      await fs.unlink(imagePath);

      // Update the product asset with the new image
      await existingProductAsset.update({
        ...req.body,
        image: fileName,
      });
    } else {
      // If no file is present, update other fields only
      await existingProductAsset.update(req.body);
    }

    
    const updatedProductAsset = await ProductAsset.findByPk(productAssetId);
    res.status(200).json(updatedProductAsset);
  } catch (error) {
    console.error('Error updating product asset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Product Asset
exports.deleteProductAsset = async (req, res) => {
  try {
    const productAssetId = req.params.id;

    
    const productAsset = await ProductAsset.findByPk(productAssetId);

    if (!productAsset) {
      return res.status(404).json({ error: 'Product asset not found' });
    }

    // Delete the associated image file
    const imagePath = path.join('public/images', productAsset.image);
    await fs.unlink(imagePath);

    // Delete the product asset from the database
    await ProductAsset.destroy({
      where: { id: productAssetId },
    });

    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting product asset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all Product Assets with Product names
exports.getAllProductAssets = async (req, res) => {
  try {
    const productAssets = await ProductAsset.findAll({
      include: [{ model: Product, attributes: ['name'] }],
    });

    res.status(200).json(productAssets);
  } catch (error) {
    console.error('Error retrieving product assets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

