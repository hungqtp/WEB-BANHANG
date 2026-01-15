
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { Product, ProductVariant } from '../types';
import { GoogleGenAI } from '@google/genai';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
      if (found.variants.length > 0) setSelectedVariant(found.variants[0]);
    } else {
      navigate('/products');
    }
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

  const currentPrice = product ? (product.basePrice + (selectedVariant?.priceDelta || 0)) : 0;
  const currentStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);

  const askAiTip = async () => {
    if (!product) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Bạn là nhân viên tư vấn bán hàng thời trang/phụ kiện. Hãy viết một đoạn ngắn (khoảng 30-50 từ) gợi ý cách sử dụng hoặc lý do nên mua sản phẩm này: ${product.name}. Mô tả sản phẩm: ${product.description}`,
      });
      setAiTip(response.text || "Gemini đang bận, vui lòng thử lại sau.");
    } catch (error) {
      console.error(error);
      setAiTip("Không thể kết nối với trí tuệ nhân tạo lúc này.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Gallery */}
        <div className="flex-1 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-pink-500 cursor-pointer">
                <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <span className="text-pink-500 font-bold uppercase text-xs tracking-widest">{product.category}</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount} đánh giá)</span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-pink-600">{currentPrice.toLocaleString()}đ</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">{(product.originalPrice + (selectedVariant?.priceDelta || 0)).toLocaleString()}đ</span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <h3 className="font-bold mb-4">Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-3">Chọn loại sản phẩm</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock === 0}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      selectedVariant?.id === v.id 
                      ? 'border-pink-500 bg-pink-50 text-pink-700' 
                      : v.stock === 0 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {v.name} {v.stock === 0 && '(Hết)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="font-bold mb-3">Số lượng</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center focus:outline-none font-bold"
                />
                <button 
                  onClick={() => setQuantity(q => Math.min(currentStock, q + 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">Còn {currentStock} sản phẩm trong kho</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              disabled={currentStock === 0}
              className="flex-1 bg-white border-2 border-pink-500 text-pink-500 py-4 rounded-2xl font-bold hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thêm vào giỏ
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={currentStock === 0}
              className="flex-1 bg-pink-500 text-white py-4 rounded-2xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mua ngay
            </button>
          </div>

          {/* AI Advisor Integration */}
          <div className="mt-auto pt-8 border-t border-gray-100">
             <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-indigo-900 font-bold flex items-center">
                    <span className="mr-2">✨</span> Trợ lý ảo Gemini gợi ý
                  </h4>
                  <button 
                    onClick={askAiTip}
                    disabled={isAiLoading}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    {isAiLoading ? 'Đang suy nghĩ...' : 'Hỏi thêm ý kiến'}
                  </button>
                </div>
                {aiTip ? (
                  <p className="text-indigo-800 text-sm italic leading-relaxed">"{aiTip}"</p>
                ) : (
                  <p className="text-indigo-400 text-sm">Bạn cần thêm cảm hứng? Nhấn hỏi Gemini ngay!</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
