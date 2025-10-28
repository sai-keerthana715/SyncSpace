import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

export default function MemberChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  function sendMessage() {
    if (!message.trim()) return;
    setChat([...chat, { from: "me", text: message }]);
    setMessage("");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Chat with Admin</h2>
      <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-white shadow-inner">
        {chat.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.from === "me" ? "text-right" : ""}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${msg.from === "me" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <TextField
          fullWidth
          label="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
}
