const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./user");
const Product = require("./product");

const Purchase = sequelize.define(
  "Purchase",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "Purchases", timestamps: true }
);

// Associations
Purchase.belongsTo(User, { foreignKey: "userId" });
Purchase.belongsTo(Product, { foreignKey: "productId" });

module.exports = Purchase;
