import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Đặt hàng thành công! ✨</h1>
      <p className="text-gray-600 text-lg mb-8">
        Cảm ơn bạn đã ủng hộ HuMiShop. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
      </p>

      <div className="bg-pink-50 rounded-3xl p-8 border border-pink-100 mb-10 inline-block w-full">
        <p className="text-pink-600 font-bold text-sm uppercase tracking-widest mb-2">Mã đơn hàng của bạn</p>
        <p className="text-3xl font-mono font-black text-gray-800 tracking-tighter">#{orderId}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/" 
          className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
        >
          Tiếp tục mua sắm
        </Link>
        <Link 
          to="/account/orders" 
          className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
        >
          Xem lịch sử đơn hàng
        </Link>
      </div>
      
      <p className="mt-12 text-gray-400 text-sm italic">
        Mọi thắc mắc vui lòng liên hệ hotline: 09xx xxx xxx
      </p>
    </div>
  );
};

export default OrderSuccess;