import { Link, useNavigate } from "react-router-dom";
// import './header.css'; // Nếu có css

const Header = () => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        padding: "20px",
        background: "#eee",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* Logo bấm về trang chủ */}
      <div
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", fontWeight: "bold" }}
      >
        MY SHOP
      </div>

      <nav>
        <ul
          style={{ display: "flex", gap: "20px", listStyle: "none", margin: 0 }}
        >
          <li>
            <Link to="/">Trang chủ</Link>
          </li>

          <li>
            <Link to="/products">Sản phẩm</Link>
          </li>

          <li>
            <Link to="/login">Đăng nhập</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
