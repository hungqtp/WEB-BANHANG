
import React from 'react';
import { MOCK_PRODUCTS } from '../../constants';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Tổng quan quản trị</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Doanh thu tháng', value: '45,000,000đ', color: 'bg-indigo-500', icon: '💰' },
          { label: 'Tổng đơn hàng', value: '1,240', color: 'bg-pink-500', icon: '📦' },
          { label: 'Khách hàng mới', value: '156', color: 'bg-green-500', icon: '👥' },
          { label: 'Đang giao', value: '24', color: 'bg-yellow-500', icon: '🚚' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Danh sách sản phẩm gần đây</h2>
            <button className="text-pink-500 text-sm font-bold">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-4 font-semibold">Sản phẩm</th>
                  <th className="pb-4 font-semibold">Giá</th>
                  <th className="pb-4 font-semibold">Tồn kho</th>
                  <th className="pb-4 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_PRODUCTS.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 font-bold">{p.basePrice.toLocaleString()}đ</td>
                    <td className="py-4">{p.stock}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded">Đang bán</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold mb-6">Thông báo hệ thống</h2>
          <div className="space-y-6">
            {[
              { msg: 'Sản phẩm "Gấu bông Teddy" sắp hết hàng', time: '2 giờ trước', type: 'warning' },
              { msg: 'Đơn hàng mới #AD1234 vừa được đặt', time: '4 giờ trước', type: 'info' },
              { msg: 'Khách hàng Nguyễn An yêu cầu hoàn tiền', time: '1 ngày trước', type: 'error' },
            ].map((noti, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${noti.type === 'warning' ? 'bg-yellow-400' : noti.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{noti.msg}</p>
                  <p className="text-xs text-gray-400 mt-1">{noti.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-gray-50 text-gray-500 text-sm font-bold rounded-xl hover:bg-gray-100">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
