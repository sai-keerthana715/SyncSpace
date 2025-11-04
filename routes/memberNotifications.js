const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Notification = require("../models/Notification");

// Get member’s own notifications
router.get("/", auth, async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifs);
  } catch (err) {
    console.error("❌ Error loading notifications:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
