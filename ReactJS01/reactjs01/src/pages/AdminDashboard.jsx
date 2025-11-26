import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Gọi API Admin để check quyền thật sự từ Server
    fetch("http://localhost:5000/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          alert("Bạn không có quyền Admin!");
          navigate("/"); // Đá về trang chủ nếu không phải admin
        }
        return res.json();
      })
      .then((data) => setMsg(data))
      .catch(() => navigate("/login"));
  }, []);

  return (
    <div className="container">
      <h1 style={{ color: "gold" }}>Khu vực quản trị (Admin Only)</h1>
      <div className="form-box" style={{ maxWidth: "800px" }}>
        <h3>{msg || "Đang kiểm tra quyền hạn..."}</h3>
        <p>Tại đây bạn có thể quản lý User, Sản phẩm, v.v.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
