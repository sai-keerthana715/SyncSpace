const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const User = require('../models/User');
const Workspace = require('../models/Workspace');

// Get all members
router.get('/members', auth, adminOnly, async (req, res) => {
  try {
    const members = await User.find({ role: 'member' }).select('-password');
    res.json(members);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create workspace
router.post('/workspaces', auth, adminOnly, async (req, res) => {
  try {
    const { name, description } = req.body;
    const ws = new Workspace({ name, description, owner: req.user._id, members: [] });
    await ws.save();
    res.json(ws);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Assign member to workspace
router.post('/workspaces/:id/assign', auth, adminOnly, async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!ws.members.includes(user._id)) {
      ws.members.push(user._id);
      await ws.save();
    }
    if (!user.workspaces.includes(ws._id)) {
      user.workspaces.push(ws._id);
      await user.save();
    }
    res.json({ workspace: ws, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// List workspaces (admin view)
router.get('/workspaces', auth, adminOnly, async (req, res) => {
  try {
    const list = await Workspace.find().populate('members', '-password');
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
