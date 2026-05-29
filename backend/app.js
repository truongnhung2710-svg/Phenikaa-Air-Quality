console.log("ĐANG CHẠY app.js TRONG ~/backend");

require("dotenv").config();

const express = require("express");
<<<<<<< HEAD
const http = require("http"); // 🎯 Thêm module http
const { Server } = require("socket.io"); // 🎯 Thêm thư viện WebSocket
=======
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const app = express();
<<<<<<< HEAD
const PORT = 5001;

/* =========================
   KHỞI TẠO HTTP SERVER & WEBSOCKET
========================= */
const server = http.createServer(app);

// Cấu hình Socket.io cho phép Frontend kết nối
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép mọi kết nối (hoặc "http://localhost:3000" nếu muốn bảo mật)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }
});

// Chia sẻ biến 'io' cho toàn bộ các file routes khác
// Để khi trạm gửi dữ liệu lên, file routes có thể dùng biến này phát thẳng về App/Web
app.set("io", io);

// Lắng nghe sự kiện khi có Web hoặc App mở lên
io.on("connection", (socket) => {
  console.log("⚡ Có client kết nối WebSocket, ID:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client ngắt kết nối WebSocket:", socket.id);
  });
});
=======
const PORT = 5000;
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46

/* =========================
   GLOBAL MIDDLEWARE
========================= */

// JSON
app.use(express.json());

<<<<<<< HEAD
// CORS — BẮT BUỘC ĐẶT TRƯỚC ROUTES
=======
//  CORS — BẮT BUỘC ĐẶT TRƯỚC ROUTES
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

<<<<<<< HEAD
=======

>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
/* =========================
   PASSPORT LOCAL STRATEGY
========================= */

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User không tồn tại" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Sai mật khẩu" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ⚠️ KHÔNG DÙNG session → KHÔNG serialize/deserialize
app.use(passport.initialize());

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
<<<<<<< HEAD
  res.send("Backend is running OK with WebSocket");
=======
  res.send("Backend is running OK");
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
});

// Health
const healthRoute = require("./routes/health.route");
app.use("/health", healthRoute);

// Auth
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// User
const userRoutes = require("./routes/user.routes");
app.use("/api/user", userRoutes);

// Device
const deviceRoutes = require("./routes/device.routes");
app.use("/api/devices", deviceRoutes);

// Reading
const readingRoutes = require("./routes/reading.routes");
app.use("/api/readings", readingRoutes);

// Alert
const alertRoutes = require("./routes/alert.routes");
app.use("/api/alerts", alertRoutes);

// Lorawan
const uplinkRouter = require("./routes/uplink.routes");
app.use("/api/lorawan", uplinkRouter);

// Test API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running",
  });
});

/* =========================
   MONGODB
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công"))
  .catch((err) =>
    console.error("❌ Lỗi kết nối MongoDB:", err.message)
  );

/* =========================
   START SERVER
========================= */

<<<<<<< HEAD
// 🎯 Đổi từ app.listen sang server.listen để chạy chung với WebSocket
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server & WebSocket running at http://0.0.0.0:${PORT}`);
});
=======
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
