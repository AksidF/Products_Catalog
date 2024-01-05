module.exports = (sequelize, DataTypes) => {
  const ProductAsset = sequelize.define('ProductAsset', {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return ProductAsset;
};