import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import { Button } from "antd";

const Header = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      user: { email: "", name: "" },
    });
    navigate("/login");
  };

  return (
    <div
      style={{ padding: 20, display: "flex", justifyContent: "space-between" }}
    >
      <div>
        <Link to="/">Home</Link>
      </div>

      <div>
        {!auth.isAuthenticated ? (
          <>
            <Link to="/login" style={{ marginRight: 10 }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: 20 }}>Welcome {auth.user.name}</span>
            <Button type="primary" danger onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
