function AuthLayout({ left, children }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f3f4f6"
    }}>
      <div style={{
        width: 900,
        height: 520,
        background: "#fff",
        borderRadius: 20,
        display: "flex",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}>
        {/* LEFT */}
        <div style={{
          width: "50%",
          padding: 40,
          color: "#fff",
          background: "linear-gradient(135deg,#7c3aed,#ec4899)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          {left}
        </div>

        {/* RIGHT */}
        <div style={{
          width: "50%",
          padding: 40
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
