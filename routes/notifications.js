const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const Notification = require("../models/Notification");

// ✅ Get all notifications (admin)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const list = await Notification.find()
      .populate("user", "name email")
      .populate("workspace", "name")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(list);
  } catch (err) {
    console.error("❌ Error loading notifications:", err);
    res.status(500).json({ message: err.message });
  }
});

router.patch('/mark-read', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: { $ne: true } },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error("❌ Error marking notifications as read:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
