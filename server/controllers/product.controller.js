const Product = require('../models/Product');

// Lấy toàn bộ sản phẩm (có thể lọc theo category nếu cần)
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
  }
};

// Tạo sản phẩm mới (Dùng cho Admin)
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Dữ liệu không hợp lệ" });
  }
};