const { Sequelize } = require('sequelize');
const CategoryModel = require('./categoryModel');
const ProductModel = require('./productModel');
const ProductAssetModel = require('./productAssetModel');
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = require('../config/database');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const Category = CategoryModel(sequelize, Sequelize);
const Product = ProductModel(sequelize, Sequelize);
const ProductAsset = ProductAssetModel(sequelize, Sequelize);

Category.hasMany(Product);
Product.belongsTo(Category);

Product.hasMany(ProductAsset);
ProductAsset.belongsTo(Product);

module.exports = {
  sequelize,
  Category,
  Product,
  ProductAsset,
};