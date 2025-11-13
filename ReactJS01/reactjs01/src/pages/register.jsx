import { Form, Input, Button, notification } from "antd";
import { createUserAPI } from "../util/api";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const onFinish = async (values) => {
    const { name, email, password } = values;
    const res = await createUserAPI(name, email, password);

    if (res.EC === 0) {
      notification.success({
        message: "Success",
        description: "Register success!",
      });
    } else {
      notification.error({
        message: "Error",
        description: res.EM,
      });
    }
  };

  return (
    <div style={{ padding: "20px 40px" }}>
      <h1>Register</h1>

      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

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
          Submit
        </Button>

        <div style={{ marginTop: 20 }}>
          <Link to="/login">Already have account?</Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
