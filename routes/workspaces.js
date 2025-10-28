const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workspace = require('../models/Workspace');

// Members and admins can list accessible workspaces
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const list = await Workspace.find().populate('members', '-password');
      return res.json(list);
    }
    // member: only their workspaces
    const list = await Workspace.find({ members: req.user._id }).populate('members', '-password');
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get single workspace
router.get('/:id', auth, async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id).populate('members', '-password');
    if (!ws) return res.status(404).json({ message: 'Not found' });
    // membership check for members
    if (req.user.role !== 'admin' && !ws.members.map(m=>m._id.toString()).includes(req.user._id.toString())) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(ws);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/workspaces/:id/tasks', auth, async (req, res) => {
  const ws = await Workspace.findById(req.params.id);
  ws.tasks = ws.tasks || [];
  ws.tasks.push({
    title: req.body.title,
    description: req.body.description,
    completed: false
  });
  await ws.save();
  res.json(ws);
});

module.exports = router;
