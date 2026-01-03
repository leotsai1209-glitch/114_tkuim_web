const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// 取得活動列表
router.get("/", async (req, res) => {
  try {
    const { status } = req.query; // 可選：?status=open
    const filter = status ? { status } : {};
    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 新增活動
router.post("/", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;