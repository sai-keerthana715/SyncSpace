const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workspace = require('../models/Workspace');

// Simple test
router.get('/test', (req, res) => {
  res.json({ message: 'Member route working!' });
});

// ✅ Get all workspaces for logged-in member
router.get('/workspaces', auth, async (req, res) => {
  try {
    const workspaces = await Workspace.find({ members: req.user._id });
    res.json(workspaces);
  } catch (err) {
    console.error("❌ Error loading member workspaces:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get single workspace
router.get('/workspaces/:id', auth, async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id).populate('members', 'name email');
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });

    if (!ws.members.some(m => m._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Not allowed to access this workspace' });
    }

    res.json(ws);
  } catch (err) {
    console.error("❌ Error loading workspace:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Create new task
router.post('/workspaces/:id/tasks', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });

    if (!ws.members.some(m => m.equals(req.user._id))) {
      return res.status(403).json({ message: 'Not allowed to add tasks here' });
    }

    const task = {
      title,
      description,
      completed: false,
      createdBy: req.user._id,
      createdAt: new Date()
    };

    ws.tasks.push(task);
    await ws.save();

    console.log("✅ Task created:", task.title);
    res.json(task);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update (toggle complete)
router.patch('/workspaces/:id/tasks/:taskId', auth, async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });

    const task = ws.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.completed = req.body.completed;
    await ws.save();

    console.log(`✅ Task ${task._id} marked as ${task.completed ? 'done' : 'undone'}`);
    res.json(task);
  } catch (err) {
    console.error("❌ Error updating task:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🟩 Edit task (title/description)
router.put('/workspaces/:id/tasks/:taskId', auth, async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });

    const task = ws.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!ws.members.some(m => m.equals(req.user._id))) {
      return res.status(403).json({ message: 'You cannot edit this task' });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    await ws.save();

    console.log(`✏️ Task edited: ${task.title}`);
    res.json(task);
  } catch (err) {
    console.error("❌ Error editing task:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🟥 Delete task
// 🟥 Delete task (fixed version)
router.delete('/workspaces/:id/tasks/:taskId', auth, async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });

    // Verify the member has access
    if (!ws.members.some(m => m.equals(req.user._id))) {
      return res.status(403).json({ message: 'You cannot delete this task' });
    }

    // Use Mongoose $pull to remove subdocument
    const updated = await Workspace.findByIdAndUpdate(
      req.params.id,
      { $pull: { tasks: { _id: req.params.taskId } } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Task not found or already deleted' });

    console.log(`🗑️ Task ${req.params.taskId} deleted successfully`);
    res.json({ message: 'Task deleted successfully', workspace: updated });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
