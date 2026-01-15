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
import Register from './pages/Register'; // ✅ THÊM
import AdminDashboard from './pages/Admin/Dashboard';

import { UserRole } from './types';

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

              {/* AUTH */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> {/* ✅ ROUTE MỚI */}

              <Route path="/checkout" element={<Checkout />} />

              {/* ADMIN */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <footer className="text-center py-6 text-gray-400">
            © 2024 AccessoPro
          </footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
