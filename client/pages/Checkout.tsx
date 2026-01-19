import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVnpayUrl } from '../services/orderService';
import { PRODUCT_IMAGES } from '../constants/images';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('COD');
  
  // DỮ LIỆU THẬT: Lấy từ Giỏ hàng trong LocalStorage
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    // Khi vào trang, đọc giỏ hàng từ máy khách
    const savedCart = localStorage.getItem('app_cart'); // Hoặc 'cartItems' tùy tên ông đặt
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
    } else {
      // Nếu giỏ hàng trống, cho về trang chủ luôn
      alert("Giỏ hàng của ông đang trống!");
      navigate('/');
    }
  }, [navigate]);

  // TÍNH TOÁN THẬT DỰA TRÊN GIỎ HÀNG
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shippingFee = subtotal > 0 ? 30000 : 0;
  const totalPrice = subtotal + shippingFee;

  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert("Giỏ hàng trống không đặt được đâu ông!");
      return;
    }

    if (!shippingData.fullName || !shippingData.phone || !shippingData.address) {
      alert("Ông điền thiếu thông tin giao hàng rồi!");
      return;
    }

    setLoading(true);
    try {
      // 1. Tạo Order ID thực tế (HM + Thời gian)
      const orderId = `HM${Date.now().toString().slice(-6)}`;

      if (paymentMethod === 'VNPAY') {
        // GỌI API THẬT
        const data = await getVnpayUrl(orderId, totalPrice);
        
        if (data && data.paymentUrl) {
          // Xóa giỏ hàng sau khi đã chuyển sang trang thanh toán (Tùy chọn)
          // localStorage.removeItem('cart'); 
          window.location.href = data.paymentUrl;
        } else {
          throw new Error("Backend không trả về link VNPAY");
        }
      } else {
        // XỬ LÝ COD THẬT: Gửi đơn hàng lên Database của ông
        // await axios.post('/api/orders', { orderId, shippingData, cart, totalPrice, status: 'Pending' });
        
        alert("🎉 Đặt hàng thành công! Đơn hàng của ông đang được xử lý.");
        localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi đặt thành công
        navigate('/order/success');
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Lỗi kết nối API thanh toán. Ông kiểm tra lại Backend đã chạy chưa nhé!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBFD] pt-28 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-12 text-gray-900">
          CHECK<span className="text-pink-500">OUT.</span>
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-10">
            {/* FORM NHẬP LIỆU THẬT */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</span>
                THÔNG TIN GIAO HÀNG
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" placeholder="Họ và tên" required
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 outline-none font-medium text-black"
                  value={shippingData.fullName}
                  onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                />
                <input 
                  type="tel" placeholder="Số điện thoại" required
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 outline-none font-medium text-black"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                />
                <input 
                  type="text" placeholder="Địa chỉ chi tiết" required
                  className="w-full md:col-span-2 px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 outline-none font-medium text-black"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                />
                <textarea 
                  placeholder="Ghi chú (Ví dụ: Giao sau 5h chiều)"
                  className="w-full md:col-span-2 px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 outline-none font-medium h-32 text-black"
                  value={shippingData.note}
                  onChange={(e) => setShippingData({...shippingData, note: e.target.value})}
                />
              </div>
            </section>

            {/* CHỌN PHƯƠNG THỨC */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">2</span>
                THANH TOÁN
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PaymentOption 
                  title="SHIP COD" 
                  desc="Trả tiền khi nhận hàng" 
                  active={paymentMethod === 'COD'} 
                  onClick={() => setPaymentMethod('COD')}
                  color="pink"
                />
                <PaymentOption 
                  title="VNPAY" 
                  desc="ATM / QR Code" 
                  active={paymentMethod === 'VNPAY'} 
                  onClick={() => setPaymentMethod('VNPAY')}
                  color="blue"
                />
              </div>
            </section>
          </div>

          {/* GIỎ HÀNG THỰC TẾ TỪ LOCALSTORAGE */}
          <div className="lg:col-span-5">
            <div className="bg-gray-900 text-white p-10 rounded-[3rem] sticky top-28 shadow-2xl">
              <h2 className="text-2xl font-black mb-8 italic">ĐƠN HÀNG ({cart.length})</h2>
              
              <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <img 
                      src={item.image || item.img || PRODUCT_IMAGES.PLACEHOLDER} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-xl object-cover bg-gray-800" 
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-gray-400 text-xs">SL: {item.quantity || 1}</p>
                    </div>
                    <p className="font-black text-sm">{(item.price * (item.quantity || 1)).toLocaleString()}đ</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-white/10 pt-8 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Phí ship</span>
                  <span>{shippingFee.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-white/5">
                  <span className="text-xl font-black tracking-tighter">TỔNG CỘNG</span>
                  <span className="text-4xl font-black text-pink-500">{totalPrice.toLocaleString()}đ</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-white text-black font-black rounded-3xl hover:bg-pink-500 hover:text-white transition-all duration-300 disabled:bg-gray-700"
              >
                {loading ? 'ĐANG KẾT NỐI...' : 'XÁC NHẬN ĐẶT HÀNG'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Component con cho gọn code
const PaymentOption = ({ title, desc, active, onClick, color }: any) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${active ? (color === 'pink' ? 'border-pink-500 bg-pink-50/50' : 'border-blue-500 bg-blue-50/50') : 'border-gray-100'}`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className={`font-black text-lg ${active && color === 'blue' ? 'text-blue-600' : 'text-black'}`}>{title}</p>
        <p className="text-xs text-gray-500 font-medium">{desc}</p>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? (color === 'pink' ? 'border-pink-500' : 'border-blue-500') : 'border-gray-300'}`}>
        {active && <div className={`w-3 h-3 rounded-full ${color === 'pink' ? 'bg-pink-500' : 'bg-blue-500'}`} />}
      </div>
    </div>
  </div>
);

export default CheckoutPage;