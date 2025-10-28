const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'todo' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
