require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

// middleware
app.use(cors({
  origin: "http://localhost:3000", // port Vite
  credentials: true
}));

app.use(express.json());

// connect db
connectDB();

// API test
app.get("/api/test", (req, res) => {
  res.json({ message: "API OK" });
});

const authRoutes = require("./routes/auth.routes.js");

// API auth
app.use("/api/auth", authRoutes);

// =======================
// SERVE CLIENT BUILD
// =======================
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));


// serve React SPA (Express v5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});


// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
