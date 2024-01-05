module.exports = (sequelize, DataTypes) => {
  const ProductAsset = sequelize.define('ProductAsset', {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return ProductAsset;
};