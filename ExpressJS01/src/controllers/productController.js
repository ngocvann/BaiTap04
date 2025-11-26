// File: src/controllers/productController.js
const Product = require("../models/Product"); // File này vừa tạo ở Bước 1

exports.getProducts = async (req, res) => {
  try {
    // 1. Lấy tham số từ query URL (mặc định là trang 1, 10 sp/trang)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 2. Tính OFFSET cho SQL
    const offset = (page - 1) * limit;

    // 3. Gọi Model để lấy dữ liệu
    // Lưu ý: Đảm bảo limit và offset là số nguyên (string sẽ gây lỗi SQL)
    const products = await Product.getAll(limit.toString(), offset.toString());
    const totalProducts = await Product.countAll();

    // 4. Trả về kết quả chuẩn form
    res.json({
      data: products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: page * limit < totalProducts, // Frontend dùng cái này để biết còn load tiếp được không
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi Server khi lấy danh sách sản phẩm" });
  }
};
