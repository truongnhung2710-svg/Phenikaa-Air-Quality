console.log("ĐANG CHẠY app.js TRONG ~/backend");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const app = express();
const PORT = 5000;

/* =========================
   GLOBAL MIDDLEWARE
========================= */

// JSON
app.use(express.json());

//  CORS — BẮT BUỘC ĐẶT TRƯỚC ROUTES
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


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
  res.send("Backend is running OK");
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
