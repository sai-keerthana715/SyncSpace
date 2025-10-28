import React, { useEffect, useState, useRef } from 'react';
import { Container, TextField, Button } from '@mui/material';
import io from 'socket.io-client';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000/chat');
    socketRef.current.on('connect', () => console.log('chat connected'));
    socketRef.current.on('message', (m) => setMessages(prev => [...prev, m]));
    // join a generic admin room
    socketRef.current.emit('joinRoom', 'admin-room');
    return () => socketRef.current.disconnect();
  }, []);

  function sendMessage() {
    if (!text) return;
    const payload = { from: 'admin', text, createdAt: new Date() };
    socketRef.current.emit('message', { roomId: 'admin-room', message: payload });
    setMessages(prev => [...prev, payload]);
    setText('');
  }

  return (
    <Container className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Admin Chat</h3>
      <div className="mb-4 border rounded p-3 h-64 overflow-auto bg-white">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
            <div className="p-2 bg-indigo-50 rounded">{m.from}: {m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <TextField fullWidth value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type a message..." />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </div>
    </Container>
  );
}
