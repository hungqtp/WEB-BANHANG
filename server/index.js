require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http"); // 1. Thêm cái này
const { Server } = require("socket.io"); // 2. Thêm cái này
const Order = require('./models/Order');
const app = express();
const server = http.createServer(app); // 3. Tạo server tích hợp

// Khởi tạo Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const productRoutes = require('./routes/product.routes');
const authRoutes = require("./routes/auth.routes.js");

// middleware
app.use(cors({
    origin: 'http://localhost:3000', // Cho phép Frontend của ông
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// connect db
connectDB();

// API tạo đơn hàng mới
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lưu đơn hàng!", error: err });
  }
});

// API lấy toàn bộ đơn hàng (Dùng cho trang Admin sau này)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Đơn mới nhất hiện lên đầu
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng!" });
  }
});

// API test
app.get("/api/test", (req, res) => {
  res.json({ message: "API OK" });
});
// Thêm route này vào server của mày
app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query; // Từ khóa khách gõ
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } }, // Tìm theo tên (không phân biệt hoa thường)
        { category: { $regex: q, $options: 'i' } }
      ]
    }).limit(5); // Chỉ lấy 5 món liên quan nhất
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tìm kiếm sản phẩm" });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
const orderRoutes = require('./utils/vnpay'); // Đảm bảo đúng đường dẫn file vừa sửa ở Bước 1
app.use('/api/orders', orderRoutes);


// =======================
// LOGIC CHAT REAL-TIME
// =======================
io.on('connection', (socket) => {
  socket.on('send_message_to_bot', async (data) => {
    // 1. Lưu tin nhắn của khách vào DB
    const newMessage = await Message.create({
      senderId: socket.id,
      content: data.text,
      role: 'user'
    });

    // 2. Nếu khách cần gặp người thật hoặc hỏi câu khó
    if (data.needsAdmin) {
      // Gửi thông báo cho tất cả các tab Admin đang mở
      io.emit('admin_notification', {
        message: "CÓ KHÁCH ĐANG ĐỢI TƯ VẤN!",
        customer: socket.id,
        content: data.text
      });
    }
  });
});

// =======================
// SERVE CLIENT BUILD
// =======================
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// start server - LƯU Ý: Đổi app.listen thành server.listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});