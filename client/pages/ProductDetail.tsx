import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ProductVariant } from '../types';
import { PRODUCT_IMAGES } from '../constants/images'; // Import kho ảnh vào đây

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null);
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
    alert('✨ Đã thêm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, selectedVariant || undefined, quantity);
    navigate('/cart');
  };

  const askAiTip = async () => {
    if (!product) return;
    setIsAiLoading(true);
    try {
      const API_KEY = "AIzaSyDgoAwZOPC3dqG8P2uYW2reHIkNJ2bfKu0"; 
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `Bạn là trợ lý bán hàng của HuMiShop. Hãy viết 1 câu tư vấn cực ngắn (dưới 15 từ), dễ thương mời khách mua sản phẩm: ${product.name}` }] 
          }]
        })
      });
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setAiTip(data.candidates[0].content.parts[0].text);
      }
    } catch (error) {
      setAiTip("Gấu bông này xinh lắm, sắm ngay kẻo hết nhé! 💖");
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentPrice = product ? ((product.price || product.basePrice) + (selectedVariant?.priceDelta || 0)) : 0;
  const currentStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);

  if (!product) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      <p className="text-gray-400 font-bold animate-pulse uppercase tracking-[0.2em]">Đang tìm gấu bông...</p>
    </div>
  );

  return (
    <div className="bg-[#FCFCFD] min-h-screen pb-20 pt-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-8">
          <Link to="/" className="hover:text-pink-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-pink-500 transition-colors text-gray-600">{product.category}</Link>
          <span>/</span>
          <span className="text-pink-500 truncate max-w-[100px]">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* 1. GALLERY SECTION - Đã sửa lỗi img ở đây */}
          <div className="flex-1 lg:max-w-[55%]">
            <div className="sticky top-28 group">
              <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  // Fix ảnh vỡ bằng placeholder từ file images.ts
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = PRODUCT_IMAGES.PLACEHOLDER;
                  }}
                />
                <div className="absolute top-8 left-8">
                  <span className="bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-2xl shadow-sm text-[10px] font-black uppercase tracking-[0.2em] text-pink-600 border border-white">
                    Premium Quality ✨
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. INFO SECTION */}
          <div className="flex-1 space-y-10 py-4">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <span className="text-4xl font-black text-pink-500 italic">
                  {currentPrice.toLocaleString()}đ
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-300 line-through font-bold">
                    {product.oldPrice.toLocaleString()}đ
                  </span>
                )}
              </div>
            </div>

            {/* AI Advisor Card */}
            <div className="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200">
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping"></span>
                    <h4 className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">HuMi AI Stylist</h4>
                  </div>
                  <p className="text-white text-xl font-medium italic mb-8 leading-relaxed">
                    "{aiTip || "Món quà này sẽ làm ai đó rất bất ngờ, bạn cần AI tư vấn thêm không?"}"
                  </p>
                  <button 
                    onClick={askAiTip} 
                    disabled={isAiLoading}
                    className="bg-white text-black px-8 py-3 rounded-2xl text-xs font-black transition-all hover:bg-pink-500 hover:text-white active:scale-95 disabled:opacity-50"
                  >
                    {isAiLoading ? 'ĐANG PHÂN TÍCH...' : '✨ NHẬN LỜI KHUYÊN'}
                  </button>
               </div>
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px]"></div>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Chọn kích thước / Màu sắc</p>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-8 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                        selectedVariant?.name === v.name 
                        ? 'border-pink-500 bg-pink-50 text-pink-600' 
                        : 'border-gray-100 bg-white text-gray-400 hover:border-pink-200 hover:text-pink-400'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-8 pt-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center bg-gray-100 rounded-[1.5rem] p-1.5 border border-gray-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 font-black text-xl hover:text-pink-500 transition-all">-</button>
                  <span className="w-12 text-center font-black text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 font-black text-xl hover:text-pink-500 transition-all">+</button>
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${currentStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {currentStock > 0 ? 'Còn hàng trong kho' : 'Tạm hết hàng'}
                  </span>
                  <span className="text-xs font-bold text-gray-400">Giao hàng từ 2-3 ngày</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className="flex-[1.2] py-6 bg-gray-900 text-white rounded-[2rem] font-black text-sm hover:bg-black transition-all active:scale-95 disabled:bg-gray-200 shadow-2xl shadow-gray-200"
                >
                  THÊM VÀO GIỎ HÀNG
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={currentStock === 0}
                  className="flex-1 py-6 bg-pink-500 text-white rounded-[2rem] font-black text-sm hover:bg-pink-600 transition-all active:scale-95 disabled:bg-gray-200 shadow-2xl shadow-pink-100"
                >
                  MUA NGAY
                </button>
              </div>
            </div>

            {/* Description Tab */}
            <div className="pt-10 border-t border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Mô tả sản phẩm</h3>
              <div className="prose prose-pink">
                <p className="text-gray-500 leading-[2] font-medium text-lg italic">
                  "{product.description}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;