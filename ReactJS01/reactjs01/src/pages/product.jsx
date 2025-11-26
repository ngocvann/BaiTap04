import { useEffect, useState } from "react";
import { fetchProductSearch } from "../util/api"; // <--- Import đúng tên hàm bạn vừa gửi
import "./product.css"; // File CSS ở bước 2

const ProductPage = () => {
  const [listProducts, setListProducts] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // State lưu trữ bộ lọc
  const [filter, setFilter] = useState({
    page: 1,
    limit: 6, // Hiển thị 6 sản phẩm 1 trang cho đẹp
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "-createdAt", // Mặc định mới nhất
  });

  // Hàm gọi API
  const handleSearchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchProductSearch(filter);
      if (res && res.data && res.data.result) {
        setListProducts(res.data.result);
        setTotalPage(res.data.meta.pages);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
    setLoading(false);
  };

  // Gọi API khi filter thay đổi (Debounce để tránh gọi liên tục khi gõ phím)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearchProducts();
    }, 600); // Đợi 0.6s sau khi người dùng ngừng thao tác mới gọi API
    return () => clearTimeout(timer);
  }, [filter]);

  // Hàm update state filter
  const handleChangeFilter = (key, value) => {
    setFilter({ ...filter, [key]: value, page: 1 }); // Reset về trang 1 khi lọc
  };

  return (
    <div className="product-container">
      <h2 className="page-title">Tìm kiếm sản phẩm</h2>

      <div className="layout-wrapper">
        {/* --- SIDEBAR BỘ LỌC (Trái) --- */}
        <div className="sidebar">
          <div className="filter-group">
            <label>Tên sản phẩm</label>
            <input
              type="text"
              placeholder="Ví dụ: iPhone..."
              onChange={(e) => handleChangeFilter("name", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Danh mục</label>
            <select
              onChange={(e) => handleChangeFilter("category", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="DIENTHOAI">Điện thoại</option>
              <option value="LAPTOP">Laptop</option>
              <option value="PHUKIEN">Phụ kiện</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Khoảng giá (VNĐ)</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <input
                type="number"
                placeholder="Min"
                onChange={(e) => handleChangeFilter("minPrice", e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                onChange={(e) => handleChangeFilter("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sắp xếp</label>
            <select
              onChange={(e) => handleChangeFilter("sort", e.target.value)}
            >
              <option value="-createdAt">Mới nhất</option>
              <option value="price">Giá thấp - cao</option>
              <option value="-price">Giá cao - thấp</option>
              <option value="-views">Lượt xem nhiều</option>
            </select>
          </div>
        </div>

        {/* --- DANH SÁCH SẢN PHẨM (Phải) --- */}
        <div className="content">
          {loading && <p>Đang tải dữ liệu...</p>}

          {!loading && listProducts.length === 0 && (
            <p>Không tìm thấy sản phẩm nào.</p>
          )}

          <div className="product-grid">
            {listProducts.map((item) => (
              <div key={item.id} className="product-card">
                {/* Nếu có ảnh thì hiện, ko thì hiện placeholder */}
                <div className="img-placeholder">
                  {item.image ? "IMG" : "No Image"}
                </div>
                <h3>{item.name}</h3>
                <p className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </p>
                <div className="meta">
                  <span>👁 {item.views}</span>
                  <span>📂 {item.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Phân trang */}
          {totalPage > 0 && (
            <div className="pagination">
              {Array.from({ length: totalPage }, (_, index) => (
                <button
                  key={index + 1}
                  className={filter.page === index + 1 ? "active" : ""}
                  onClick={() => setFilter({ ...filter, page: index + 1 })}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
