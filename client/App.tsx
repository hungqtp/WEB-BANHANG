import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Bỏ Router ở đây nếu index.tsx đã có
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ChatBox from './components/ChatBox';
import Profile from './pages/Profile';


import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register'; 
import AdminProductNew from "./pages/Admin/ProductNew";
import AdminDashboard from "./pages/Admin/Dashboard";
import { UserRole } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Tất cả Route con bắt buộc phải nằm trong này */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> 
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />

              {/* Route cho Admin */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Chú ý: Route này phải nằm TRONG thẻ <Routes> */}
              <Route path="/admin/products/new" element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminProductNew />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <ChatBox />
          
          <footer className="bg-white border-t py-6 text-center text-gray-400 text-sm">
            © 2026 HuMiShop - Phụ kiện Aesthetic ✨
          </footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;