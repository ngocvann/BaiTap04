const { Op } = require("sequelize");
const Product = require("../models/product");
const FavoriteProduct = require("../models/favoriteProduct");
const Purchase = require("../models/purchase");
const Comment = require("../models/comment");
const User = require("../models/user");
const { searchProducts } = require("./searchService");

const getProductsWithFilter = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 6;

  const { total, pages, items } = await searchProducts(query);

  return {
    meta: {
      current: page,
      pageSize: limit,
      pages,
      total,
    },
    result: items,
  };
};

const addFavorite = async (userId, productId) => {
  // findOrCreate để bấm nhiều lần không bị lỗi unique
  const [favorite] = await FavoriteProduct.findOrCreate({
    where: { userId, productId },
  });
  return favorite;
};

const removeFavorite = async (userId, productId) => {
  const rowsDeleted = await FavoriteProduct.destroy({
    where: { userId, productId },
  });
  return rowsDeleted;
};

const getFavoriteProductsByUser = async (userId) => {
  const favorites = await FavoriteProduct.findAll({
    where: { userId },
    include: [
      {
        model: Product,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // trả về mảng Product
  return favorites.map((f) => f.Product);
};

const isFavorite = async (userId, productId) => {
  const favorite = await FavoriteProduct.findOne({
    where: { userId, productId },
  });
  return !!favorite;
};

const getProductDetail = async (productId) => {
  return await Product.findOne({ where: { id: productId } });
};

const increaseViews = async (id) => {
  const product = await Product.findByPk(id);
  if (product) {
    product.views++;
    await product.save();
  }
};

const countBuyers = async (productId) => {
  return await Purchase.count({ where: { productId } });
};

const countComments = async (productId) => {
  return await Comment.count({ where: { productId } });
};

const getComments = async (productId) => {
  return await Comment.findAll({
    where: { productId },
    include: [{ model: User, attributes: ["name"] }],
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  getProductsWithFilter,
  addFavorite,
  removeFavorite,
  getFavoriteProductsByUser,
  isFavorite,
  getProductDetail,
  increaseViews,
  getComments,
  countComments,
  countBuyers,
};
