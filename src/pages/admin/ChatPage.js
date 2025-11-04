import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { TextField, Button, Typography, Box } from "@mui/material";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [members, setMembers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // 🧠 Define socketRef here
  const socketRef = useRef(null);

  // 🔗 Connect socket once
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    if (user?._id) socket.emit("register", user._id);

    socket.on("chat_message", (msg) => {
      // Filter messages for this chat only
      if (
        (msg.sender === user._id && msg.receiver === selectedMember) ||
        (msg.sender === selectedMember && msg.receiver === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // 🔔 Listen for new message notifications (for admin or member)
    socket.on("notification", (notif) => {
      console.log("📩 New notification received:", notif);
      // You can later trigger a toast or badge update here
    });

    return () => socket.disconnect();
  }, [selectedMember]);

  // 🧩 Load members (for admin)
  useEffect(() => {
    if (user.role === "admin") loadMembers();
  }, []);

  // 🧩 Load chat messages when member selected
  useEffect(() => {
    if (selectedMember) loadChat(selectedMember);
  }, [selectedMember]);

  async function loadMembers() {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/members", {
        headers: { Authorization: "Bearer " + token },
      });
      setMembers(res.data);
    } catch (err) {
      console.error("❌ Error loading members:", err);
    }
  }

  async function loadChat(memberId) {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${memberId}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Error loading chat:", err);
    }
  }

  async function sendMessage() {
    if (!content.trim() || !selectedMember) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { receiverId: selectedMember, content },
        { headers: { Authorization: "Bearer " + token } }
      );

      setMessages([...messages, res.data]);
      setContent("");

      // ✅ Emit message via socket for real-time update
      if (socketRef.current) socketRef.current.emit("chat_message", res.data);

      // ✅ Send notification to receiver (admin/member)
      if (socketRef.current) {
        socketRef.current.emit("notification", {
          type: "new_message",
          message: `💬 New message from ${user.name}`,
          sender: user._id,
          receiver: selectedMember,
        });
      }
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  }

  return (
    <Box sx={{ display: "flex", gap: 3, p: 4 }}>
      {/* Members list */}
      <Box sx={{ width: 250, borderRight: "1px solid #ddd", pr: 2 }}>
        <Typography variant="h6" gutterBottom>
          Members
        </Typography>
        {members.map((m) => (
          <Box
            key={m._id}
            onClick={() => setSelectedMember(m._id)}
            sx={{
              p: 1,
              cursor: "pointer",
              borderRadius: 1,
              bgcolor: selectedMember === m._id ? "#eee" : "transparent",
            }}
          >
            {m.name}
          </Box>
        ))}
      </Box>

      {/* Chat area */}
      <Box sx={{ flex: 1 }}>
        {selectedMember ? (
          <>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                height: 400,
                overflowY: "auto",
                mb: 2,
              }}
            >
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    textAlign: msg.sender._id === user._id ? "right" : "left",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      display: "inline-block",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      bgcolor:
                        msg.sender._id === user._id
                          ? "primary.main"
                          : "grey.200",
                      color:
                        msg.sender._id === user._id ? "white" : "black",
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Type a message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Button variant="contained" onClick={sendMessage}>
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Typography>Select a member to start chat</Typography>
        )}
      </Box>
    </Box>
  );
}
