import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Logic lấy đường dẫn quay lại:
  // Ưu tiên 1: Lấy từ state (do ProtectedRoute gửi sang)
  // Ưu tiên 2: Lấy từ URL query ?redirect=...
  // Ưu tiên 3: Về trang chủ "/"
  const from = location.state?.from?.pathname || 
               new URLSearchParams(location.search).get("redirect") || 
               "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
        return;
      }

      login(data.token, data.user);
      
      // 2. Điều hướng về trang 'from' đã xác định ở trên
      navigate(from, { replace: true });
      
    } catch (err) {
      console.error(err);
      setError("Không kết nối được server");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Đăng nhập
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 text-center">
             <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold mt-6 hover:bg-pink-700 transition-all shadow-lg active:scale-95"
        >
          ĐĂNG NHẬP
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-pink-600 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;