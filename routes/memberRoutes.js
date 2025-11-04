const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workspace = require('../models/Workspace');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ✅ Test route
router.get('/test', (req, res) => res.json({ message: 'Member route working!' }));

// ✅ Get all accepted workspaces
router.get('/workspaces', auth, async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      members: req.user._id,
    }).populate('owner', 'name email');
    res.json(workspaces);
  } catch (err) {
    console.error("❌ Error loading member workspaces:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get a single workspace by ID
router.get('/workspaces/:id', auth, async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id)
      .populate('members', 'name email')
      .populate('owner', 'name email');

    if (!ws) return res.status(404).json({ message: 'Workspace not found' });

    // Allow only accepted members or owner
    const memberAccepted =
      ws.members.some(m => String(m) === String(req.user._id)) ||
      (ws.memberResponses &&
        ws.memberResponses.some(
          r => String(r.member) === String(req.user._id) && r.response === 'accept'
        ));

    if (!memberAccepted && String(ws.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Access denied to this workspace' });
    }

    res.json(ws);
  } catch (err) {
    console.error('❌ Error loading workspace:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Accept workspace
router.patch('/workspaces/:id/accept', auth, async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });

    const entry = ws.memberResponses.find(r => String(r.member) === String(req.user._id));
    if (!entry) return res.status(404).json({ message: 'No assignment found for this member' });

    entry.response = 'accept';
    if (!ws.members.some(m => String(m) === String(req.user._id))) {
      ws.members.push(req.user._id);
    }

    await ws.save();

    // 🔔 Notify admin
    const io = req.app.get('io');
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      const notif = new Notification({
        type: 'workspace_accept',
        message: `✅ ${req.user.name} accepted workspace "${ws.name}"`,
        user: req.user._id,
        workspace: ws._id,
      });
      await notif.save();
      io.to(admin._id.toString()).emit('notification', notif);
    }

    res.json({ message: 'Workspace accepted', workspace: ws });
  } catch (err) {
    console.error('❌ Error accepting workspace:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Reject workspace
router.patch('/workspaces/:id/reject', auth, async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });

    const entry = ws.memberResponses.find(r => String(r.member) === String(req.user._id));
    if (!entry) return res.status(404).json({ message: 'No assignment found for this member' });

    entry.response = 'reject';
    ws.members = ws.members.filter(m => String(m) !== String(req.user._id));

    await ws.save();

    // 🔔 Notify admin
    const io = req.app.get('io');
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      const notif = new Notification({
        type: 'workspace_reject',
        message: `❌ ${req.user.name} rejected workspace "${ws.name}"`,
        user: req.user._id,
        workspace: ws._id,
      });
      await notif.save();
      io.to(admin._id.toString()).emit('notification', notif);
    }

    res.json({ message: 'Workspace rejected', workspace: ws });
  } catch (err) {
    console.error('❌ Error rejecting workspace:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Create task inside a workspace
router.post('/workspaces/:id/tasks', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });

    const entry = ws.memberResponses.find(r => String(r.member) === String(req.user._id));
    const isAllowed = ws.members.some(m => m.equals(req.user._id)) || (entry && entry.response === 'accept');
    if (!isAllowed) return res.status(403).json({ message: 'Not allowed to add tasks' });

    const task = { title, description, completed: false, createdBy: req.user._id, createdAt: new Date() };
    ws.tasks.push(task);
    await ws.save();

    // 🔔 Notify admin
    const io = req.app.get('io');
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      const notif = new Notification({
        type: 'task_created',
        message: `🆕 ${req.user.name} created task "${title}" in "${ws.name}"`,
        user: req.user._id,
        workspace: ws._id,
      });
      await notif.save();
      io.to(admin._id.toString()).emit('notification', notif);
    }

    res.status(201).json(task);
  } catch (err) {
    console.error('❌ Error creating task:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update task status (drag & drop or completion)
router.patch('/workspaces/:id/tasks/:taskId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const ws = await Workspace.findById(req.params.id).populate('owner', '_id name');
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });

    const task = ws.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Update status and save
    task.status = status;
    task.completed = status === 'done';
    await ws.save();

    const io = req.app.get('io');

    // Notify workspace room (for all members)
    io.to(req.params.id).emit('task_updated', { taskId: task._id, status });

    // Also notify admin room for dashboard updates
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      io.to(admin._id.toString()).emit('task_count_update', {
        workspaceId: ws._id,
        status,
      });
    }

    res.json(task);
  } catch (err) {
    console.error('❌ Error updating task status:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
