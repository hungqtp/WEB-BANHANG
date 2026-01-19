import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const [status, setStatus] = useState<'success' | 'fail' | 'cod'>('cod');
  const [vnpParams, setVnpParams] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Trích xuất dữ liệu từ URL sau khi VNPAY redirect về
    const query = new URLSearchParams(location.search);
    const responseCode = query.get('vnp_ResponseCode');
    const transactionNo = query.get('vnp_TransactionNo');
    const orderId = query.get('vnp_TxnRef');

    if (responseCode) {
      if (responseCode === '00') {
        setStatus('success');
      } else {
        setStatus('fail');
      }
      setVnpParams({
        orderId: orderId || '',
        transactionNo: transactionNo || '',
      });
    }
  }, [location]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center min-h-[80vh] flex flex-col justify-center">
      {/* ICON HIỂN THỊ */}
      <div className="mb-10 flex justify-center">
        {status === 'fail' ? (
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-500 shadow-inner animate-bounce">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        ) : (
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 shadow-inner animate-pulse">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )}
      </div>

      {/* TIÊU ĐỀ */}
      <h1 className="text-5xl font-black italic tracking-tighter text-gray-900 mb-6 uppercase">
        {status === 'success' && "Thanh toán xong xuôi! ✨"}
        {status === 'fail' && "Thanh toán thất bại ❌"}
        {status === 'cod' && "Đặt hàng thành công! 🧸"}
      </h1>

      <p className="text-gray-500 text-lg mb-10 font-medium max-w-md mx-auto">
        {status === 'success' && "Cảm ơn ông đã tin tưởng HuMi. Tiền đã vào túi shop, hàng sẽ sớm tới tay ông!"}
        {status === 'fail' && "Có vẻ như giao dịch bị gián đoạn. Đừng lo, tiền của ông vẫn an toàn, hãy thử lại nhé."}
        {status === 'cod' && "Đơn hàng đang được xử lý. Ông vui lòng để ý điện thoại để shipper đẹp trai liên hệ nhé!"}
      </p>

      {/* BOX THÔNG TIN ĐƠN HÀNG */}
      <div className={`rounded-[2.5rem] p-10 border-2 mb-12 transition-all ${status === 'fail' ? 'bg-red-50 border-red-100' : 'bg-[#FDFBFD] border-gray-100 shadow-sm'}`}>
        <p className={`font-black text-xs uppercase tracking-[0.2em] mb-3 ${status === 'fail' ? 'text-red-400' : 'text-pink-500'}`}>
          {status === 'fail' ? "Lý do: Giao dịch bị hủy hoặc lỗi thẻ" : "Thông tin định danh đơn hàng"}
        </p>
        
        <div className="space-y-2">
          <p className="text-4xl font-mono font-black text-gray-800 tracking-tighter">
            #{vnpParams.orderId || "HUMI_ORDER"}
          </p>
          {vnpParams.transactionNo && (
            <p className="text-sm font-bold text-gray-400">Mã GD VNPAY: {vnpParams.transactionNo}</p>
          )}
        </div>
      </div>

      {/* NÚT ĐIỀU HƯỚNG */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/" 
          className="px-10 py-5 bg-black text-white rounded-2xl font-black hover:bg-pink-500 transition-all active:scale-95 shadow-lg shadow-black/10"
        >
          TIẾP TỤC MUA SẮM
        </Link>
        <Link 
          to="/account/orders" 
          className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black hover:bg-gray-50 transition-all active:scale-95"
        >
          XEM ĐƠN HÀNG
        </Link>
      </div>
      
      <p className="mt-16 text-gray-400 text-xs font-bold uppercase tracking-widest">
        Hotline hỗ trợ: 09xx xxx xxx • HuMi Shop 2026
      </p>
    </div>
  );
};

export default OrderSuccess;