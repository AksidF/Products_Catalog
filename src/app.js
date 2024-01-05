const express = require('express');
const fileUpload = require('express-fileupload');
const { sequelize } = require('./models');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productAssetRoutes = require('./routes/productAssetRoutes'); 
const PORT = process.env.PORT || 3000;

const app = express();

// Use express-fileupload middleware
app.use(fileUpload());

// Use product and category routes
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes); 
app.use('/product-assets', productAssetRoutes);

// Sync models with the database
sequelize.sync({ alter: false }).then(() => {
  console.log('Database synced');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});