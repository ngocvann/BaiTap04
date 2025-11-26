import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <Router>
      <nav>
        <Link to="/">Trang Chủ</Link>
        <Link to="/products">Sản Phẩm</Link>
        <Link to="/admin">Admin Dashboard</Link>
        <Link to="/login">Đăng Nhập</Link>

        <button onClick={handleLogout}>Đăng Xuất</button>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <h1>Chào mừng đến với Shop ReactJS</h1>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
