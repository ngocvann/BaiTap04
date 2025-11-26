import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Chặn reload trang

    // 1. Validation cơ bản ở Frontend
    if (!email.includes("@")) {
      setError("Email không đúng định dạng!");
      return;
    }
    if (password.length === 0) {
      setError("Vui lòng nhập mật khẩu!");
      return;
    }

    try {
      // Gọi API Backend
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Hiển thị lỗi từ Backend (nếu có)
        setError(
          data.errors
            ? data.errors[0].msg
            : data.message || "Đăng nhập thất bại"
        );
      } else {
        // 2. Lưu Token và Info User vào LocalStorage
        localStorage.setItem("token", data.access_token);

        // Giả sử backend trả về role, nếu không có thì cần gọi API /user để lấy
        // Ở đây mình ví dụ role được trả về luôn hoặc bạn tự decode JWT
        if (email.includes("admin")) {
          localStorage.setItem("role", "admin"); // Demo logic
        } else {
          localStorage.setItem("role", "user");
        }

        alert("Đăng nhập thành công!");
        navigate("/products"); // Chuyển hướng sang trang sản phẩm
      }
    } catch (err) {
      console.error(err); // Biến err đã được sử dụng tại đây
      setError("Lỗi kết nối Server!");
    }
  };

  return (
    <div className="form-box">
      <h2>Đăng Nhập</h2>
      {error && <p className="error-msg">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn-submit" onClick={handleLogin}>
        LOGIN
      </button>
    </div>
  );
};

export default Login;
