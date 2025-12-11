import { useEffect, useState } from "react";
import { fetchProductSearch } from "../util/api";
import { useAuth } from "../components/context/auth.context";
import "./product.css";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const [listProducts, setListProducts] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const { user, favorites, toggleFavorite } = useAuth();

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

  // Gọi API
  const handleSearchProducts = async () => {
    setLoading(true);
    try {
      // axios đã trả về data => res CHÍNH LÀ object data từ backend
      const res = await fetchProductSearch(filter);

      if (res && res.result) {
        setListProducts(res.result);
        setTotalPage(res.meta?.pages || 0);
      } else {
        setListProducts([]);
        setTotalPage(0);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      setListProducts([]);
      setTotalPage(0);
    }
    setLoading(false);
  };

  // Gọi API khi filter thay đổi (debounce 0.6s)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearchProducts();
    }, 600);
    return () => clearTimeout(timer);
  }, [filter]);

  // Hàm update state filter
  const handleChangeFilter = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset về trang 1 khi lọc
    }));
  };

  const handleToggleFavorite = async (productId) => {
    if (!user) {
      alert("Bạn cần đăng nhập để thêm sản phẩm yêu thích");
      return;
    }
    await toggleFavorite(productId);
    // state favorites sẽ được context tự cập nhật lại
  };

  const isFavoriteProduct = (id) =>
    Array.isArray(favorites) && favorites.some((p) => p.id === id);

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
              placeholder="Ví dụ: Harry Potter..."
              onChange={(e) => handleChangeFilter("name", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Danh mục</label>
            <select
              onChange={(e) => handleChangeFilter("category", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="MANGA">Manga</option>
              <option value="LIGHTNOVEL">Light Novel</option>
              <option value="KINHTE">Kinh tế</option>
              <option value="TAMLY">Tâm lý</option>
              <option value="TIEUTHUYET">Tiểu thuyết</option>
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
            {listProducts.map((item) => {
              const isFav = isFavoriteProduct(item.id);

              return (
                <Link
                  to={`/products/${item.id}`}
                  key={item.id}
                  className="product-card"
                >
                  <div className="product-card-header">
                    <div className="img-placeholder">
                      {item.image ? (
                        <img src={item.image} alt="" className="card-image" />
                      ) : (
                        "No Image"
                      )}
                    </div>
                  </div>

                  <div className="product-title-row">
                    <h3>{item.name}</h3>

                    <button
                      className={`favorite-toggle ${isFav ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFavorite(item.id);
                      }}
                    >
                      {isFav ? "♥" : "♡"}
                    </button>
                  </div>

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
                </Link>
              );
            })}
          </div>

          {/* Phân trang */}
          {totalPage > 0 && (
            <div className="pagination">
              {Array.from({ length: totalPage }, (_, index) => (
                <button
                  key={index + 1}
                  className={filter.page === index + 1 ? "active" : ""}
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, page: index + 1 }))
                  }
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
