const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const createUserService = async (name, email, password) => {
  const check = await User.findOne({ where: { email } });
  if (check) return { EC: 1, EM: "Email đã tồn tại!" };

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
    role: "user",
  });

  return { EC: 0, EM: "OK", data: user };
};

const loginService = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return { EC: 1, EM: "Email không tồn tại!" };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { EC: 1, EM: "Sai mật khẩu!" };

  const token = jwt.sign(
    { email: user.email, name: user.name },
    process.env.JWT_SECRET || "SECRET",
    { expiresIn: "1h" }
  );

  return { EC: 0, EM: "OK", token, user };
};

const getUserService = async () => {
  const list = await User.findAll({ attributes: { exclude: ["password"] } });
  return list;
};

module.exports = { createUserService, loginService, getUserService };
