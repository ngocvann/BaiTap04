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

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  // Ở đây bạn sẽ viết logic gọi Database để xóa (ví dụ: await User.delete(userId))
  // Tạm thời trả về thông báo thành công để server chạy được
  return res.status(200).json({
    message: `Đã thực hiện lệnh xóa user có ID: ${userId}`,
    status: "success",
  });
};

module.exports = { createUser, handleLogin, getUser, getAccount, deleteUser };
