import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // FIX: Thêm axios
import { useCart } from '../context/CartContext';
import { Product, ProductVariant } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null); // Để any tạm thời nếu Type chưa cập nhật image đơn
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]);
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        navigate('/products');
      }
    };
    if (id) fetchProductDetail();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedVariant || undefined, quantity);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, selectedVariant || undefined, quantity);
    navigate('/cart');
  };

  // FIX: Dùng price thay cho basePrice nếu bạn đã sửa ở Database
  const currentPrice = product ? ((product.price || product.basePrice) + (selectedVariant?.priceDelta || 0)) : 0;
  const currentStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);

const askAiTip = async () => {
  if (!product) return;
  setIsAiLoading(true);
  try {
    // 1. Dán KEY MỚI bạn vừa lấy vào đây
    const API_KEY = "AIzaSyDgoAwZOPC3dqG8P2uYW2reHIkNJ2bfKu0"; 

    // 2. Sử dụng Endpoint trực tiếp (Đây là cách ổn định nhất)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: `Bạn là trợ lý bán hàng của HuMiShop. Hãy viết 1 câu tư vấn cực ngắn, dễ thương mời khách mua sản phẩm: ${product.name}` }] 
        }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      setAiTip(data.candidates[0].content.parts[0].text);
    } else {
      console.error("Lỗi Google trả về:", data);
      setAiTip("AI đang bận, bạn thử lại sau nhé!");
    }
  } catch (error) {
    console.error("Lỗi mạng:", error);
    setAiTip("Không kết nối được AI, kiểm tra lại mạng nhé!");
  } finally {
    setIsAiLoading(false);
  }
};

  if (!product) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Gallery - FIX: Dùng product.image vì Database chỉ có 1 ảnh */}
        <div className="flex-1 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <span className="text-pink-500 font-bold uppercase text-xs tracking-widest">{product.category}</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-pink-600">{currentPrice.toLocaleString()}đ</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <h3 className="font-bold mb-4">Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
          </div>

          {/* Nút bấm */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button onClick={handleAddToCart} disabled={currentStock === 0} className="flex-1 border-2 border-pink-500 text-pink-500 py-4 rounded-2xl font-bold hover:bg-pink-50">
              Thêm vào giỏ
            </button>
            <button onClick={handleBuyNow} disabled={currentStock === 0} className="flex-1 bg-pink-500 text-white py-4 rounded-2xl font-bold hover:bg-pink-600">
              Mua ngay
            </button>
          </div>

          {/* AI Advisor */}
          <div className="mt-auto pt-8 border-t border-gray-100">
             <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-indigo-900 font-bold">✨ Trợ lý Gemini gợi ý</h4>
                  <button onClick={askAiTip} disabled={isAiLoading} className="text-xs font-bold text-indigo-600">
                    {isAiLoading ? 'Đang suy nghĩ...' : 'Hỏi AI'}
                  </button>
                </div>
                <p className="text-indigo-800 text-sm italic">"{aiTip || "Nhấn nút để nhận tư vấn từ AI!"}"</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;