const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // URL hình ảnh
  category: { type: String, required: true }, // Ví dụ: 'Gấu bông', 'Móc khóa'
  stock: { type: Number, default: 0 },
  tags: [String], // Để AI tìm kiếm nhanh (ví dụ: ['quà tặng', 'mềm', 'pink'])
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);