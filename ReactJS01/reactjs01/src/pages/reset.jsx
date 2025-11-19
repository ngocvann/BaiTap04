import { Form, Input, Button, notification } from "antd";
import { resetPasswordAPI } from "../util/api";

const ResetPage = () => {
  const onFinish = async ({ email, otp, newPassword }) => {
    const res = await resetPasswordAPI(email, otp, newPassword);

    if (res.EC === 0) {
      notification.success({
        message: "Success",
        description: "Đổi mật khẩu thành công!",
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
      <h1>Reset Password</h1>

      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="OTP" name="otp" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Reset Password
        </Button>
      </Form>
    </div>
  );
};

export default ResetPage;
