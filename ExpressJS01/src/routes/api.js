const express = require("express");
const routerAPI = express.Router();
const { body, validationResult } = require("express-validator");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  deleteUser,
} = require("../controllers/userController");
const productController = require("../controllers/productController");
const { auth, checkAdmin } = require("../middleware/auth");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

routerAPI.get("/", (req, res) => res.json("Hello MYSQL API"));

routerAPI.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu tối thiểu 6 ký tự"),
    body("username").notEmpty().withMessage("Username không được để trống"),
  ],
  validateRequest,
  createUser
);
routerAPI.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email sai định dạng"),
    body("password").notEmpty().withMessage("Chưa nhập mật khẩu"),
  ],
  validateRequest,
  handleLogin
);

routerAPI.get("/user", getUser);
routerAPI.get("/account", auth, getAccount);

routerAPI.get("/admin/users", auth, checkAdmin, (req, res) => {
  res.json({ message: "Admin Access Granted" });
});

routerAPI.get("/products", productController.getProducts);

routerAPI.get("/admin/dashboard", auth, checkAdmin, (req, res) => {
  res.json("Chào mừng Admin quay trở lại!");
});

routerAPI.delete("/delete-user/:id", checkAdmin, deleteUser);

module.exports = routerAPI;
