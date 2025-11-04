const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const workspaceRoutes = require('./routes/workspaces');
const taskRoutes = require('./routes/tasks');
const memberRoutes = require('./routes/memberRoutes');
const notificationRoutes = require('./routes/notifications');
const chatRoutes = require("./routes/chat");
const memberNotifRoutes = require('./routes/memberNotifications');
const documentRoutes = require('./routes/documents');

const app = express();
const server = http.createServer(app);

// ✅ Create Socket.IO server
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

// ✅ WebSocket handler
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  // Register each user by their ID
  socket.on('register', (userId) => {
    socket.join(userId);
    console.log(`📦 User ${userId} joined personal room`);
  });

  // new: join workspace room for Kanban updates
  socket.on('join_workspace', (workspaceId) => {
    socket.join(workspaceId);
    console.log(`📦 Socket ${socket.id} joined workspace ${workspaceId}`);
  });


  // ✅ Chat message relay (between sender/receiver)
  socket.on("chat_message", (msg) => {
    if (!msg.sender || !msg.receiver) return;
    io.to(msg.receiver.toString()).emit("chat_message", msg);
    io.to(msg.sender.toString()).emit("chat_message", msg);
  });

  // Disconnect log
  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/admin/notifications', notificationRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/member/notifications', memberNotifRoutes);
app.use('/api/documents', documentRoutes);

// ✅ MongoDB connection
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SyncSpace';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error', err));

// ✅ Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
