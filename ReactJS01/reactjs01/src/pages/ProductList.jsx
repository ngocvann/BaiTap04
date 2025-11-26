import { useState, useEffect } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (loading) return;
      setLoading(true);
      try {
        // Thay URL này bằng API thực tế của bạn
        const res = await fetch(
          `http://localhost:5000/api/products?page=${page}&limit=10`
        );
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setProducts((prev) => [...prev, ...data.data]);
          // Nếu số lượng trả về < limit -> Hết dữ liệu
          if (data.data.length < 10) setHasMore(false);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.log("Lỗi lấy sản phẩm", err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [page]);

  // Xử lý sự kiện cuộn chuột (Infinite Scroll)
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="container">
      <h2>Danh Sách Sản Phẩm (Lazy Loading)</h2>
      <div className="product-grid">
        {products.map((prod, index) => (
          <div key={`${prod.id}-${index}`} className="product-card">
            {/* Hiển thị ảnh giả lập nếu chưa có ảnh thật */}
            <img
              src={prod.image || "https://via.placeholder.com/150"}
              alt={prod.name}
              style={{ width: "100%", borderRadius: "4px" }}
            />
            <h3>{prod.name || `Sản phẩm ${prod.id}`}</h3>
            <p style={{ color: "#4caf50", fontWeight: "bold" }}>
              {prod.price ? `${prod.price} VNĐ` : "Liên hệ"}
            </p>
          </div>
        ))}
      </div>

      {loading && <p className="loading">⏳ Đang tải thêm sản phẩm...</p>}
      {!hasMore && <p className="loading">✅ Đã hiển thị hết sản phẩm.</p>}
    </div>
  );
};

export default ProductList;
