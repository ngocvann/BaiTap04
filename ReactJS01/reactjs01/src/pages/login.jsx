import { Form, Input, Button, notification } from "antd";
import { loginAPI } from "../util/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/context/auth.context";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onFinish = async ({ email, password }) => {
    const res = await loginAPI(email, password);

    if (res.EC === 0) {
      // Lưu token
      localStorage.setItem("token", res.token);

      // Lưu user vào context
      setUser(res.user);

      notification.success({
        message: "Đăng nhập thành công!",
      });

      navigate("/");
    } else {
      notification.error({
        message: "Lỗi đăng nhập",
        description: res.EM,
      });
    }
  };

  return (
    <div style={{ padding: "20px 40px" }}>
      <h1>Login</h1>

      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Login
        </Button>

        <div style={{ marginTop: 20 }}>
          <Link to="/register">Don't have an account?</Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
