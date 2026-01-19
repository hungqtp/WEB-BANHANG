import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'security'>('info');

  const mockOrders = [
    { id: 'HMS-12345', date: '25/10/2023', total: 350000, status: 'shipping', items: 2 },
    { id: 'HMS-67890', date: '20/10/2023', total: 185000, status: 'completed', items: 1 },
  ];

  return (
    <div className="bg-[#fdfaff] min-h-screen pb-20">
      {/* Background Decor - Tạo hiệu ứng chiều sâu */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-pink-500 to-rose-400 opacity-10 blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: SIDEBAR NAV (Modern Card) */}
          <div className="lg:col-span-4">
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl shadow-pink-100/50 border border-white sticky top-24">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-tr from-pink-500 to-rose-300 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-pink-200 rotate-3">
                    <span className="-rotate-3">{user?.name?.charAt(0) || 'H'}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg text-pink-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                  </div>
                </div>
                <h1 className="mt-6 text-2xl font-black text-gray-900 tracking-tight">{user?.name || "HuMi Member"}</h1>
                <p className="text-gray-400 font-medium text-sm">{user?.email || "member@humishop.vn"}</p>
                <div className="mt-4 px-4 py-1.5 bg-pink-50 text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  Verified Member
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'info', label: 'Hồ sơ cá nhân', icon: '👤' },
                  { id: 'orders', label: 'Lịch sử mua hàng', icon: '📦' },
                  { id: 'security', label: 'Bảo mật & MK', icon: '🔐' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                      activeTab === tab.id 
                      ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 translate-x-2' 
                      : 'text-gray-400 hover:bg-pink-50 hover:text-pink-500'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-rose-400 hover:bg-rose-50 transition-all mt-10">
                  <span>🚪</span> Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* CỘT PHẢI: CONTENT AREA */}
          <div className="lg:col-span-8">
            <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 shadow-xl shadow-pink-100/30 border border-white min-h-[600px]">
              
              {/* TAB: THÔNG TIN TÀI KHOẢN */}
              {activeTab === 'info' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tighter">HỒ SƠ CỦA TÔI</h2>
                      <p className="text-gray-400 text-sm font-medium">Quản lý thông tin để nhận ưu đãi tốt hơn</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="text-[11px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Họ và tên</label>
                      <input type="text" readOnly value={user?.name} className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-inner focus:border-pink-300 focus:ring-4 focus:ring-pink-50 transition-all font-bold text-gray-700" />
                    </div>
                    <div className="group">
                      <label className="text-[11px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Số điện thoại</label>
                      <input type="text" placeholder="09xx xxx xxx" className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-inner focus:border-pink-300 focus:ring-4 focus:ring-pink-50 transition-all font-bold text-gray-700" />
                    </div>
                    <div className="md:col-span-2 group">
                      <label className="text-[11px] font-black text-pink-400 uppercase tracking-widest ml-1 mb-2 block">Địa chỉ mặc định</label>
                      <textarea rows={3} placeholder="Ví dụ: 123 Đường ABC, Quận XYZ..." className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-inner focus:border-pink-300 focus:ring-4 focus:ring-pink-50 transition-all font-bold text-gray-700 resize-none" />
                    </div>
                  </div>

                  <button className="mt-12 w-full md:w-auto px-12 py-4 bg-pink-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-pink-200 hover:bg-pink-600 hover:-translate-y-1 transition-all active:scale-95">
                    CẬP NHẬT THÔNG TIN
                  </button>
                </div>
              )}

              {/* TAB: LỊCH SỬ ĐƠN HÀNG */}
              {activeTab === 'orders' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-8">ĐƠN HÀNG ĐÃ ĐẶT</h2>
                  <div className="space-y-6">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="group bg-white p-6 rounded-[2rem] border border-gray-50 shadow-md hover:shadow-xl hover:border-pink-100 transition-all duration-300">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-xl shadow-lg">🎁</div>
                            <div>
                              <p className="font-black text-gray-900">{order.id}</p>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{order.date} • {order.items} sản phẩm</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-pink-500">{order.total.toLocaleString()}đ</p>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                              order.status === 'shipping' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                            }`}>
                              {order.status === 'shipping' ? '🚚 Đang giao' : '✅ Hoàn thành'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;