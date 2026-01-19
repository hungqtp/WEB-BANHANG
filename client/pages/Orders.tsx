import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PRODUCT_IMAGES } from '../constants/images';

// Định nghĩa kiểu dữ liệu cho Order
interface OrderItem {
  product: {
    name: string;
    image: string;
  };
  variantName?: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Lấy token từ localStorage để xác thực người dùng
        const token = localStorage.getItem('token');
        const res = await axios.get("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Lỗi lấy lịch sử đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      case 'shipped': return 'bg-blue-100 text-blue-600';
      default: return 'bg-orange-100 text-orange-600';
    }
  };

  if (loading) return <div className="p-10 text-center font-bold animate-pulse text-gray-400">ĐANG TẢI ĐƠN HÀNG...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">LỊCH SỬ <span className="text-pink-500">MUA HÀNG</span></h2>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{orders.length} đơn hàng</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-medium mb-6">Bạn chưa có đơn hàng nào cả 🧸</p>
          <Link to="/products" className="inline-block bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-pink-500 transition-all">
            ĐI MUA SẮM NGAY
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 group">
              {/* Order Header */}
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mã đơn hàng</p>
                  <p className="font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ngày đặt</p>
                  <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                  {order.status}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50">
                      <img 
                        src={item.product.image} 
                        alt="" 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target as HTMLImageElement).src = PRODUCT_IMAGES.PLACEHOLDER}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 leading-tight">{item.product.name}</h4>
                      <p className="text-xs text-gray-400 font-medium">
                        {item.variantName ? `${item.variantName} | ` : ''} x{item.quantity}
                      </p>
                    </div>
                    <p className="font-black text-gray-900">{(item.price * item.quantity).toLocaleString()}đ</p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-end">
                <button className="text-[10px] font-black text-pink-500 uppercase tracking-widest hover:underline">
                  Xem chi tiết đơn &rarr;
                </button>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Tổng thanh toán</p>
                  <p className="text-2xl font-black text-pink-500 italic">{order.totalAmount.toLocaleString()}đ</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;