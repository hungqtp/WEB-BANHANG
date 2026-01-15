import { useState } from "react";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Đăng ký thất bại");
        return;
      }

      alert("Đăng ký thành công 🎉");
      console.log(data);

    } catch (error) {
      console.error(error);
      alert("Không kết nối được server");
    }
  };

  return (
    <AuthLayout
      left={
        <>
          <h2 style={{ fontSize: 32, fontWeight: "bold" }}>
            Chào mừng bạn!
          </h2>
          <p>
            Tạo tài khoản để mua sắm và quản lý đơn hàng dễ dàng.
          </p>
          <span style={{ fontSize: 14 }}>
            © 2024 AccessoPro
          </span>
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

        <button style={btnStyle} type="submit">
          Đăng ký
        </button>
      </form>
    </AuthLayout>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: 16,
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "#ec4899",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontSize: 16,
  cursor: "pointer"
};

export default Register;
