import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import "./layout.css";
import { Heart } from "lucide-react";

const Layout = () => {
  const { user, favorites } = useAuth();

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            NgV Shop
          </Link>

          <input className="search-bar" placeholder="Tìm kiếm sản phẩm..." />

          <nav className="nav">
            <Link to="/">Trang chủ</Link>
            <Link to="/products">Sản phẩm</Link>
          </nav>

          <div className="header-icons">
            <Link to="/favorites" className="icon-btn">
              <Heart /> <span>{favorites.length}</span>
            </Link>

            {user ? (
              <div className="user-info">
                <img
                  src={user.avatar || "/user_default.jpg"}
                  alt="avatar"
                  className="avatar"
                />
                <span className="username">{user.name}</span>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn login-btn">
                  Đăng nhập
                </Link>
                <Link to="/register" className="auth-btn register-btn">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">© 2025 SHOP. All rights reserved.</footer>
    </>
  );
};

export default Layout;
