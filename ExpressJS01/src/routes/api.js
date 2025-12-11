const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => res.json("Hello MYSQL API"));
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", forgotPassword);
routerAPI.post("/reset-password", resetPassword);

routerAPI.get("/user", getUser);
routerAPI.get("/account", auth, getAccount);

routerAPI.get("/products", productController.getProducts);

routerAPI.post(
  "/products/:id/favorite",
  auth,
  productController.toggleFavorite
);
routerAPI.get("/favorites", auth, productController.getMyFavorites);

routerAPI.get("/products/:id", productController.getProductDetail);

routerAPI.post("/products/:id/comment", auth, productController.addComment);

routerAPI.delete("/comments/:id", auth, productController.deleteComment);

routerAPI.put("/comments/:id", auth, productController.updateComment);

module.exports = routerAPI;
