
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <svg className="w-24 h-24 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng đang trống</h2>
        <p className="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy tiếp tục mua sắm nhé!</p>
        <Link to="/products" className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition-all inline-block">
          Xem tất cả sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-10">Giỏ hàng của bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* List items */}
        <div className="flex-[2] space-y-6">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-pink-600 font-bold mt-1">{item.price.toLocaleString()}đ</p>
                <div className="flex items-center mt-3 space-x-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="text-red-500 text-xs font-bold hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{(item.price * item.quantity).toLocaleString()}đ</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold mb-6">Tổng đơn hàng</h3>
            <div className="space-y-4 mb-6 border-b border-gray-100 pb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between text-sm italic">
                <span>Giảm giá</span>
                <span>- 0đ</span>
              </div>
            </div>
            <div className="flex justify-between text-2xl font-extrabold mb-8">
              <span>Tổng cộng</span>
              <span className="text-pink-600">{totalPrice.toLocaleString()}đ</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Tiến hành thanh toán
            </button>
            <div className="mt-6 text-center">
              <Link to="/products" className="text-sm text-gray-400 hover:text-pink-500 font-medium">
                &larr; Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
