
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import { UserRole } from './types';

const OrderSuccess = ({ orderId }: { orderId?: string }) => (
  <div className="max-w-7xl mx-auto px-4 py-20 text-center">
    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h2>
    <p className="text-gray-500 mb-2">Mã đơn hàng của bạn là: <span className="font-bold text-indigo-600">#{orderId || 'SUCCESS'}</span></p>
    <p className="text-gray-500 mb-10">Chúng tôi sẽ sớm liên hệ để xác nhận đơn hàng.</p>
    <Link to="/" className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600">
      Tiếp tục mua sắm
    </Link>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              
              {/* Customer Routes */}
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={[UserRole.CUSTOMER, UserRole.ADMIN]}>
                  <div className="p-8">Hồ sơ người dùng (Feature in development)</div>
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute allowedRoles={[UserRole.CUSTOMER, UserRole.ADMIN]}>
                  <div className="p-8">Lịch sử đơn hàng (Feature in development)</div>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-gray-100 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                AccessoPro
              </span>
              <p className="text-gray-400 mt-4 text-sm">&copy; 2023 AccessoPro. Mọi quyền được bảo lưu.</p>
              <div className="flex justify-center space-x-6 mt-6">
                <a href="#" className="text-gray-400 hover:text-pink-500">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-pink-500">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-pink-500">TikTok</a>
              </div>
            </div>
          </footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
