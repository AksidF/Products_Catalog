const express = require('express');
const multer = require('multer');
const { sequelize } = require('./models');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productAssetRoutes = require('./routes/productAssetRoutes'); 
const PORT = process.env.PORT || 3000;

const app = express();

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

// Use multer middleware to handle form data
const upload = multer({ storage });
app.use(upload.single('image'));

// Use product and category routes
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes); 
app.use('/product-assets', productAssetRoutes);

// Sync models with the database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});