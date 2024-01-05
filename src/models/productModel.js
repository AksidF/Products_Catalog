module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      price: {
        type: DataTypes.DECIMAL(10),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Product;
  };