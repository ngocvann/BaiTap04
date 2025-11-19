import { Form, Input, Button, notification } from "antd";
import { forgotPasswordAPI } from "../util/api";

const ForgotPage = () => {
  const onFinish = async ({ email }) => {
    const res = await forgotPasswordAPI(email);

    if (res.EC === 0) {
      notification.success({
        message: "Success",
        description: "OTP đã gửi vào email của bạn!",
      });
    } else {
      notification.error({
        message: "Error",
        description: res.EM,
      });
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Forgot Password</h1>

      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Send OTP
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPage;
