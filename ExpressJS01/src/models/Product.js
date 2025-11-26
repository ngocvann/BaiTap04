// File: src/models/Product.js
const connection = require("../config/database"); // <-- Kiểm tra đúng tên file config DB của bạn

const Product = {
  // Hàm lấy tất cả sản phẩm có phân trang
  getAll: async (limit, offset) => {
    // Nếu dùng mysql2/promise
    const [rows] = await connection.execute(
      "SELECT * FROM Products LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;

    // Nếu dùng mysql thường (callback) thì bạn cần bọc Promise hoặc dùng query thường
  },

  // Hàm đếm tổng số sản phẩm
  countAll: async () => {
    const [rows] = await connection.execute(
      "SELECT COUNT(*) as total FROM Products"
    );
    return rows[0].total;
  },
};

module.exports = Product;
