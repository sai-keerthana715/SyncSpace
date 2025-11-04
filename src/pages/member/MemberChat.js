import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { TextField, Button, Typography, Box } from "@mui/material";

export default function MemberChat() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [admin, setAdmin] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

  // ✅ Connect socket once
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    // Register user room
    if (user?._id) socket.emit("register", user._id);

    // Listen for new messages
    socket.on("chat_message", (msg) => {
      if (
        (msg.sender === user._id && msg.receiver === admin?._id) ||
        (msg.sender === admin?._id && msg.receiver === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [admin]);

  // Load admin info
  useEffect(() => {
    async function loadAdmin() {
      try {
        const res = await axios.get("http://localhost:5000/api/member/admin-info", {
          headers: { Authorization: "Bearer " + token },
        });
        setAdmin(res.data);
        loadChat(res.data._id);
      } catch (err) {
        console.error("❌ Error loading admin info:", err);
      }
    }
    loadAdmin();
  }, []);

  // Load previous chat history
  async function loadChat(adminId) {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${adminId}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  }

  // Send message
  async function sendMessage() {
  if (!content.trim() || !admin) return;

  try {
    const res = await axios.post(
      "http://localhost:5000/api/chat",
      { receiverId: admin._id, content },
      { headers: { Authorization: "Bearer " + token } }
    );

    // ✅ 1. Update the chat instantly in your local state
    setMessages((prev) => [...prev, res.data]);
    setContent("");

    // ✅ 2. Emit the message over the WebSocket to notify admin in real-time
    if (socketRef.current) {
      socketRef.current.emit("chat_message", res.data);
    }

  } catch (err) {
    console.error("❌ Error sending message:", err);
  }
}


  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Chat with Admin
      </Typography>

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
                  msg.sender._id === user._id ? "primary.main" : "grey.200",
                color: msg.sender._id === user._id ? "white" : "black",
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
    </Box>
  );
}
