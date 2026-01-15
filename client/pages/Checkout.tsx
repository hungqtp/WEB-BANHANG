
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShippingInfo } from '../types';

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'TRANSFER'>('COD');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.phone || !shipping.address) {
      alert('Vui lòng điền đầy đủ thông tin nhận hàng');
      return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      clearCart();
      setIsProcessing(false);
      navigate(`/order-success/${orderId}`);
    }, 1500);
  };

  if (cart.length === 0) {
    return <div className="py-20 text-center">Giỏ hàng của bạn đang trống.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-10">Thanh toán</h1>
      
      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-12">
        {/* Form Fields */}
        <div className="flex-[2] space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center mr-3 text-sm">1</span>
              Thông tin nhận hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Họ và tên</label>
                <input 
                  type="text" 
                  required
                  value={shipping.fullName}
                  onChange={(e) => setShipping({...shipping, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Số điện thoại</label>
                <input 
                  type="tel" 
                  required
                  value={shipping.phone}
                  onChange={(e) => setShipping({...shipping, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                  placeholder="0912 345 678"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Địa chỉ cụ thể</label>
                <input 
                  type="text" 
                  required
                  value={shipping.address}
                  onChange={(e) => setShipping({...shipping, address: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                  placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Ghi chú (tùy chọn)</label>
                <textarea 
                  value={shipping.note}
                  onChange={(e) => setShipping({...shipping, note: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none h-24"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center mr-3 text-sm">2</span>
              Phương thức thanh toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={() => setPaymentMethod('COD')}
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                />
                <div className="ml-4">
                  <p className="font-bold">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-xs text-gray-500">Thanh toán bằng tiền mặt khi shipper giao hàng</p>
                </div>
              </label>
              <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'TRANSFER' ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="TRANSFER" 
                  checked={paymentMethod === 'TRANSFER'} 
                  onChange={() => setPaymentMethod('TRANSFER')}
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                />
                <div className="ml-4">
                  <p className="font-bold">Chuyển khoản ngân hàng</p>
                  <p className="text-xs text-gray-500">Chuyển tiền qua ứng dụng ngân hàng / QR</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold mb-6">Đơn hàng của bạn</h3>
            <div className="max-h-60 overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-center text-sm">
                  <div className="flex gap-3">
                    <img src={item.image} className="w-12 h-12 rounded object-cover" alt="" />
                    <div>
                      <p className="font-bold line-clamp-1">{item.name}</p>
                      <p className="text-gray-400">x{item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold">{(item.price * item.quantity).toLocaleString()}đ</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-6 border-t border-gray-100 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí ship</span>
                <span>0đ</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-pink-600">
                <span>Tổng tiền</span>
                <span>{totalPrice.toLocaleString()}đ</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className={`w-full bg-pink-500 text-white py-4 rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg flex items-center justify-center space-x-2 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Đặt hàng ngay</span>
              )}
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-4">
              Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
