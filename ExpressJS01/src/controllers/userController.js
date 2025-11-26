const {
  createUserService,
  loginService,
  getUserService,
} = require("../services/userService");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(data);
};

const getUser = async (req, res) => {
  const data = await getUserService();
  res.status(200).json(data);
};

const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

const sendMail = require("../util/sendMail");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(400).json({ EC: 1, EM: "Email không tồn tại!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    await user.save();

    await sendMail(email, "Your OTP Code", `<h1>Your OTP: ${otp}</h1>`);

    return res.json({ EC: 0, EM: "OTP đã gửi vào email của bạn!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ EC: -1, EM: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || user.otp !== otp)
      return res.status(400).json({ EC: 1, EM: "OTP không hợp lệ!" });

    const hash = await bcrypt.hash(newPassword, 10);

    user.password = hash;
    user.otp = null;
    await user.save();

    return res.json({ EC: 0, EM: "Đổi mật khẩu thành công!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ EC: -1, EM: "Server error" });
  }
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  resetPassword,
  forgotPassword,
};
