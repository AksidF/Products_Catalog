const { Category } = require('../models');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({
      name,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const [updatedRowsCount] = await Category.update(req.body, {
        where: { id: categoryId },
      });
  
      if (updatedRowsCount === 0) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        // Fetch the updated category separately
        const updatedCategory = await Category.findByPk(categoryId);
        
        if (updatedCategory) {
          res.status(200).json(updatedCategory);
        } else {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const deletedRowCount = await Category.destroy({
        where: { id: categoryId },
      });
  
      if (deletedRowCount === 0) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        // Explicitly send a response body for a 204 status
        res.status(200).json({ message: 'Category deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};