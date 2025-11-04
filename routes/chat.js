const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const User = require("../models/User"); // To get sender name

// ✅ Get chat history between two users
router.get("/:receiverId", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const receiverId = req.params.receiverId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching chat:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Send new message + notification
router.post("/", auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    // Save the message
    const msg = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    await msg.save();

    // Get sender info for notification
    const sender = await User.findById(senderId).select("name role");

    // Access socket.io
    const io = req.app.get("io");

    // ✅ Notify only the receiver (not the sender)
    if (sender.role !== "admin") {
      // Only notify admin when a MEMBER sends message
      const notif = new Notification({
        type: "chat_message",
        message: `💬 New message from ${sender.name}: "${content}"`,
        user: sender._id,
        workspace: null,
      });
      await notif.save();

      io.to(receiverId.toString()).emit("notification", notif);
    }

    // 🔥 Emit chat message to both users (so they see it live)
    io.to(receiverId.toString()).emit("chat_message", msg);
    io.to(senderId.toString()).emit("chat_message", msg);

    res.json(msg);
  } catch (err) {
    console.error("❌ Chat send error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
