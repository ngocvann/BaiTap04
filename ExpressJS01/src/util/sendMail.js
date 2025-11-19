const nodemailer = require("nodemailer");

const sendMail = async (to, subject, html) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your_app_password",
    },
  });

  await transporter.sendMail({
    from: "System",
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
