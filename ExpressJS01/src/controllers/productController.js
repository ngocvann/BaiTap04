const { getProductsWithFilter } = require("../services/productService");
const productService = require("../services/productService");
const Product = require("../models/product");
const Comment = require("../models/comment");
const {
  countBuyers,
  countComments,
  getComments,
} = require("../services/productService");
const User = require("../models/user");

const getProducts = async (req, res) => {
  try {
    const data = await getProductsWithFilter(req.query);

    return res.status(200).json({
      meta: data.meta,
      result: data.result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const isFav = await productService.isFavorite(userId, productId);

    if (isFav) {
      await productService.removeFavorite(userId, productId);
      return res.status(200).json({ success: true, favorite: false });
    } else {
      await productService.addFavorite(userId, productId);
      return res.status(200).json({ success: true, favorite: true });
    }
  } catch (error) {
    console.error("toggleFavorite error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error (toggleFavorite)" });
  }
};

const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await productService.getFavoriteProductsByUser(userId);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("getMyFavorites error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error (getMyFavorites)" });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const productId = req.params.id;

    const page = Number(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    let product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await productService.increaseViews(productId);
    product.views += 1;

    const buyers = await countBuyers(productId);

    // ⭐ PHÂN TRANG COMMENT
    const { rows: comments, count: totalComments } =
      await Comment.findAndCountAll({
        where: { productId },
        include: [{ model: User, attributes: ["name", "avatar"] }],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

    return res.json({
      success: true,
      product,
      stats: {
        buyers,
        commentsCount: totalComments,
      },
      comments,
      totalComments,
      page,
    });
  } catch (e) {
    console.error("getProductDetail ERROR:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const userId = req.user.id; // từ token
    const productId = req.params.id;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Nội dung trống!" });
    }

    const newComment = await Comment.create({
      userId,
      productId,
      content,
    });

    return res.json({
      success: true,
      comment: newComment,
    });
  } catch (err) {
    console.error("addComment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const c = await Comment.findByPk(id);
    if (!c)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy comment!" });

    if (c.userId !== userId)
      return res.status(403).json({
        success: false,
        message: "Bạn không thể xoá bình luận của người khác!",
      });

    await c.destroy();

    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
};

const updateComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;

    const c = await Comment.findByPk(id);
    if (!c) return res.status(404).json({ success: false });

    if (c.userId !== userId)
      return res.status(403).json({
        success: false,
        message: "Không thể sửa bình luận của người khác!",
      });

    c.content = content;
    await c.save();

    return res.json({ success: true, comment: c });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
};

module.exports = {
  getProducts,
  toggleFavorite,
  getMyFavorites,
  getProductDetail,
  addComment,
  deleteComment,
  updateComment,
};
