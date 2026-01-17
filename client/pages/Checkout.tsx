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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (paymentMethod === 'TRANSFER') {
        alert("Tính năng ZaloPay sắp ra mắt. Hiện tại hãy dùng COD nhé!");
        setIsProcessing(false);
        return;
      }

      // Giả lập xử lý đơn hàng
      setTimeout(() => {
        const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
        clearCart();
        navigate(`/order-success/${orderId}`);
      }, 2000);

    } catch (err) {
      alert("Lỗi đặt hàng!");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) return <div className="py-20 text-center font-medium">Giỏ hàng trống.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Xác nhận đơn hàng</h1>
        
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI: THÔNG TIN */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Bước 1: Thông tin giao hàng */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">01</span>
                <h2 className="text-xl font-bold text-gray-800">Thông tin giao hàng</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Họ và tên</label>
                  <input type="text" required placeholder="Nguyễn Văn A" 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-medium"
                    value={shipping.fullName} onChange={(e)=>setShipping({...shipping, fullName: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Số điện thoại</label>
                  <input type="tel" required placeholder="0901234xxx" 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-medium"
                    value={shipping.phone} onChange={(e)=>setShipping({...shipping, phone: e.target.value})} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Địa chỉ nhận hàng</label>
                  <input type="text" required placeholder="Số nhà, tên đường, phường/xã..." 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-medium"
                    value={shipping.address} onChange={(e)=>setShipping({...shipping, address: e.target.value})} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Ghi chú (tùy chọn)</label>
                  <textarea rows={2} placeholder="Lời nhắn cho cửa hàng..." 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-medium resize-none"
                    value={shipping.note} onChange={(e)=>setShipping({...shipping, note: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Bước 2: Thanh toán */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">02</span>
                <h2 className="text-xl font-bold text-gray-800">Phương thức thanh toán</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setPaymentMethod('COD')} 
                  className={`relative p-5 rounded-2xl cursor-pointer border-2 transition-all flex items-center gap-4 ${paymentMethod === 'COD' ? 'border-pink-500 bg-pink-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-pink-500' : 'border-gray-300'}`}>
                    {paymentMethod === 'COD' && <div className="w-3 h-3 bg-pink-500 rounded-full" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Thanh toán COD</p>
                    <p className="text-xs text-gray-500">Trả tiền khi nhận hàng</p>
                  </div>
                </div>

                <div onClick={() => setPaymentMethod('TRANSFER')} 
                  className={`relative p-5 rounded-2xl cursor-pointer border-2 transition-all flex items-center gap-4 ${paymentMethod === 'TRANSFER' ? 'border-pink-500 bg-pink-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'TRANSFER' ? 'border-pink-500' : 'border-gray-300'}`}>
                    {paymentMethod === 'TRANSFER' && <div className="w-3 h-3 bg-pink-500 rounded-full" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Chuyển khoản / ZaloPay</p>
                    <p className="text-xs text-gray-500">Thanh toán nhanh qua QR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-10">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100" />
                    <div className="flex-1 min-w-0 text-sm">
                      <p className="font-bold text-gray-800 truncate">{item.name}</p>
                      <p className="text-gray-400">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-800 text-sm">{(item.price * item.quantity).toLocaleString()}đ</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-dashed pt-6 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-800">{totalPrice.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-green-500">Miễn phí</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2 text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-pink-600">{totalPrice.toLocaleString()}đ</span>
                </div>
              </div>

              <button type="submit" disabled={isProcessing} 
                className={`w-full py-5 rounded-2xl font-black text-white text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-pink-200 
                  ${isProcessing ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 active:scale-[0.98]'}`}>
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ĐANG XỬ LÝ...
                  </>
                ) : 'XÁC NHẬN ĐẶT HÀNG'}
              </button>
              
              <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed">
                Bằng việc nhấn đặt hàng, bạn đồng ý với các <br/> điều khoản dịch vụ của HuMiShop.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;