const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => res.json("Hello MYSQL API"));
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", forgotPassword);
routerAPI.post("/reset-password", resetPassword);

routerAPI.get("/user", getUser);
routerAPI.get("/account", auth, getAccount);

module.exports = routerAPI;
