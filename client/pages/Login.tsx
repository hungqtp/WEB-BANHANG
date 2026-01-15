import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Có lỗi xảy ra");
        setLoading(false);
        return;
      }

      // Lưu token
      localStorage.setItem("token", data.token);

      // Lưu user vào context
      login(data.user.email, data.user.role as UserRole);

      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });

    } catch (err) {
      setError("Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">

        {/* LEFT */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-500 to-pink-500 p-12 text-white flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              {isRegister ? "Chào mừng bạn!" : "Chào mừng trở lại!"}
            </h2>
            <p className="text-indigo-100">
              {isRegister
                ? "Tạo tài khoản để mua sắm và quản lý đơn hàng dễ dàng."
                : "Đăng nhập để tiếp tục mua sắm cùng AccessoPro."}
            </p>
          </div>
          <p className="text-sm">© 2024 AccessoPro Team</p>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h3 className="text-2xl font-bold mb-8">
            {isRegister ? "Đăng ký tài khoản" : "Đăng nhập"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">Mật khẩu</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold hover:bg-pink-600 transition disabled:opacity-60"
            >
              {loading
                ? "Đang xử lý..."
                : isRegister
                ? "Đăng ký"
                : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-pink-500 font-bold hover:underline"
            >
              {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
