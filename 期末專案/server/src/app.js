const eventRoutes = require("./routes/eventRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// 連資料庫
connectDB();

// 掛路由（這行就是 /api/events 的來源）
app.use('/api/events', eventRoutes);


app.get("/", (req, res) => {
  res.json({ success: true, message: "API running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});