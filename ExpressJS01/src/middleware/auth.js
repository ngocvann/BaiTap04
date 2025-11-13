const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET");
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json("Token không hợp lệ!");
  }
};

module.exports = auth;
