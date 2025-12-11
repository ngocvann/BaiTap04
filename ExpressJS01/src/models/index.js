const Product = require("./product");
const FavoriteProduct = require("./favoriteProduct");

// Associations
Product.hasMany(FavoriteProduct, { foreignKey: "productId" });
FavoriteProduct.belongsTo(Product, { foreignKey: "productId" });

module.exports = {
  Product,
  FavoriteProduct,
};
