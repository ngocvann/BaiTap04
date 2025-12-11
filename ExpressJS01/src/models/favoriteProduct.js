const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const FavoriteProduct = sequelize.define(
  "FavoriteProduct",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "product_id",
    },
  },
  {
    timestamps: true,
    tableName: "FavoriteProducts",
    indexes: [{ unique: true, fields: ["user_id", "product_id"] }],
  }
);

module.exports = FavoriteProduct;
