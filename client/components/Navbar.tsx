import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
              AccessoPro
            </span>
          </Link>

          <div className="hidden md:flex flex-1 mx-8 max-w-lg">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-pink-500 font-medium hidden sm:block">Cửa hàng</Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-pink-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                {/* 1. Mở rộng vùng nhận hover của button bằng padding dọc (py-2) */}
                <button className="flex items-center space-x-2 text-gray-700 font-medium py-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block truncate max-w-[100px]">{user.name}</span>
                </button>

                {/* 2. Menu được bọc trong một thẻ div có pt-2 (padding top) thay vì margin-top */}
                <div className="absolute right-0 w-48 pt-2 hidden group-hover:block z-[100]">
                  {/* 3. Phần khung trắng bên trong */}
                  <div className="py-2 bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden">
                    {user.role === UserRole.ADMIN && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">Quản trị</Link>
                    )}
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">Hồ sơ</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">Đơn hàng</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Đăng xuất</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-pink-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-pink-600 transition-colors">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;