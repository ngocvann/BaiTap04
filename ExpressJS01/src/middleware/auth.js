const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json("Vui lòng cung cấp token!");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET");
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json("Token không hợp lệ!");
  }
};

const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json("Chưa đăng nhập!");
  }

  if (req.user.role === "admin" || req.user.role === "ADMIN") {
    next();
  } else {
    return res.status(403).json("Bạn không có quyền truy cập (Admin only)!");
  }
};

module.exports = { auth, checkAdmin };
