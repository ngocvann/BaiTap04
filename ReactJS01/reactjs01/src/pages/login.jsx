import { Form, Input, Button, notification } from "antd";
import { loginAPI } from "../util/api";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password } = values;
    const res = await loginAPI(email, password);

    if (res.EC === 0) {
      notification.success({
        message: "Success",
        description: "Login success",
      });

      localStorage.setItem("access_token", res.token);
      navigate("/");
    } else {
      notification.error({
        message: "Error",
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
