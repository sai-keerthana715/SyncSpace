const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');

// Create task - user must be admin or member of workspace
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, workspaceId, assigneeId } = req.body;
    if (!title || !workspaceId) return res.status(400).json({ message: 'Missing fields' });
    const ws = await Workspace.findById(workspaceId);
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });
    // check permission
    if (req.user.role !== 'admin' && !ws.members.map(m=>m.toString()).includes(req.user._id.toString())) {
      return res.status(403).json({ message: 'Not member of workspace' });
    }
    const task = new Task({ title, description, workspace: workspaceId, assignee: assigneeId || null, createdBy: req.user._id });
    await task.save();
    // emit via socket if available
    const io = req.app.get('io');
    if (io) {
      io.of('/boards').to(workspaceId).emit('taskCreated', task);
    }
    res.json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get tasks for a workspace
router.get('/workspace/:wid', auth, async (req, res) => {
  try {
    const wid = req.params.wid;
    const ws = await Workspace.findById(wid);
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });
    if (req.user.role !== 'admin' && !ws.members.map(m=>m.toString()).includes(req.user._id.toString())) {
      return res.status(403).json({ message: 'Not member of workspace' });
    }
    const tasks = await Task.find({ workspace: wid }).populate('assignee', '-password');
    res.json(tasks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
