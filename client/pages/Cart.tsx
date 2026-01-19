import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { isAuthenticated } = useAuth(); // ✅ Thêm dòng này
  const navigate = useNavigate();

  // 2. Tạo hàm xử lý riêng cho nút Thanh Toán
  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      // Nếu chưa login, đá sang login và bảo nó sau khi xong thì quay lại checkout
      navigate('/login?redirect=checkout');
    } else {
      // Nếu login rồi thì đi thẳng
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="mb-8 flex justify-center">
          <div className="bg-pink-50 p-8 rounded-full">
            <svg className="w-20 h-20 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-black mb-4 text-gray-800">Giỏ hàng trống trơn!</h2>
        <p className="text-gray-500 mb-10 text-lg">Hàng ngàn gấu bông đang chờ bạn đó.</p>
        <Link to="/products" className="bg-pink-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-600 shadow-lg shadow-pink-200 transition-all">
          ĐI SHOPPING NGAY
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Giỏ hàng</h1>
        <span className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
          {cart.length} món
        </span>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* List items */}
        <div className="flex-[2] space-y-6">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="group flex items-center gap-6 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <img src={item.image} alt={item.name} className="w-28 h-28 rounded-2xl object-cover shadow-inner" />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 truncate group-hover:text-pink-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Phân loại: <span className="text-indigo-500 font-medium">{item.variantName || 'Mặc định'}</span>
                </p>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold"
                    > − </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold"
                    > + </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="text-red-400 hover:text-red-600 text-sm font-bold flex items-center gap-1"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{(item.price * item.quantity).toLocaleString()}đ</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Đơn giá: {item.price.toLocaleString()}đ</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Summary */}
        <div className="flex-1">
          <div className="bg-gray-900 text-white rounded-[40px] p-8 shadow-2xl sticky top-24 border border-gray-800">
            <h3 className="text-2xl font-bold mb-8 border-b border-gray-800 pb-4">Đơn hàng</h3>
            
            <div className="space-y-5 mb-10">
              <div className="flex justify-between text-gray-400">
                <span>Tạm tính</span>
                <span className="text-white font-bold">{totalPrice.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Phí vận chuyển</span>
                <span className="text-green-400 font-bold">Miễn phí</span>
              </div>
              <div className="h-px bg-gray-800 my-2"></div>
              <div className="flex justify-between items-end">
                <span className="text-gray-400">Tổng cộng</span>
                <div className="text-right">
                  <p className="text-4xl font-black text-pink-500">{totalPrice.toLocaleString()}đ</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckoutClick}
              className="w-full bg-pink-600 text-white py-5 rounded-[24px] font-black text-xl hover:bg-pink-700 transition-all shadow-xl shadow-pink-900/40 active:scale-95"
            >
              THANH TOÁN NGAY
            </button>
            
            <div className="mt-8 pt-6 border-t border-gray-800 flex justify-center">
               <Link to="/products" className="text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-2">
                 ← Tiếp tục xem gấu
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;