import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import AuthLayout from "../components/AuthLayout";

// 1. Định nghĩa cấu trúc dữ liệu cho Form
interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [captchaInput, setCaptchaInput] = useState<string>("");
  const [captchaCode, setCaptchaCode] = useState<string>("");

  const generateCaptcha = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // 2. Định nghĩa kiểu cho sự kiện thay đổi Input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 3. Định nghĩa kiểu cho sự kiện Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (captchaInput.toUpperCase() !== captchaCode) {
      alert("Mã Captcha không đúng!");
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Đăng ký thất bại");
        return;
      }

      alert("Đăng ký thành công 🎉");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("Không kết nối được server");
    }
  };

  return (
    <AuthLayout
      left={
        <>
          <h2 style={{ fontSize: 32, fontWeight: "bold" }}>Đăng Ký Đi</h2>
          <p>Phải tạo tài khoản thì mới được mua hàng </p>
          <span style={{ fontSize: 14 }}>© 2026 HuMiShop</span>
        </>
      }
    >
      <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Đăng ký tài khoản
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Tên"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Xác nhận mật khẩu"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={captchaBoxStyle}>
            {captchaCode}
          </div>
          <input
            placeholder="Nhập mã"
            value={captchaInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCaptchaInput(e.target.value)}
            required
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          />
          <button 
            type="button" 
            onClick={generateCaptcha}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}
          >
            🔄
          </button>
        </div>

        <button style={btnStyle} type="submit">
          Đăng ký
        </button>
      </form>
    </AuthLayout>
  );
}

// 4. Định nghĩa kiểu CSS cho TypeScript
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: 16,
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
  boxSizing: "border-box" 
};

const captchaBoxStyle: React.CSSProperties = {
  padding: "10px 15px",
  background: "#fdf2f8",
  borderRadius: 10,
  fontWeight: "bold",
  letterSpacing: 4,
  border: "1px dashed #ec4899",
  color: "#ec4899",
  userSelect: "none"
};

const btnStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "#ec4899",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer"
};

export default Register;