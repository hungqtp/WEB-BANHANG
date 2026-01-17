const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const Product = require('../models/Product');


router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct); // Bạn nên thêm middleware check Admin ở đây

// API lấy danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy chi tiết 1 sản phẩm bằng ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "ID không hợp lệ" });
  }
});

module.exports = router;