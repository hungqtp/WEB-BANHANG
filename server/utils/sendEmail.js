// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendOrderEmail = async (order) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const mailOptions = {
    from: 'HuMi Shop <noreply@humishop.com>',
    to: order.shippingAddress.email,
    subject: `Xác nhận đơn hàng #${order._id}`,
    html: `<h1>Cảm ơn ông đã mua hàng tại HuMi!</h1>
           <p>Đơn hàng của ông đang được xử lý (Hình thức: COD).</p>
           <p>Tổng tiền: ${order.totalPrice.toLocaleString()}đ</p>`
  };

  await transporter.sendMail(mailOptions);
};