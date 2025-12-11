const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
  },
  {
    timestamps: true,
    tableName: "Products",
  }
);

module.exports = Product;
