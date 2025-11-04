const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Document = require('../models/Document');

// Create a new document for a workspace
router.post('/:workspaceId', auth, async (req, res) => {
  try {
    const doc = new Document({
      title: req.body.title || "Untitled Document",
      workspace: req.params.workspaceId,
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all documents for a workspace
router.get('/:workspaceId', auth, async (req, res) => {
  const docs = await Document.find({ workspace: req.params.workspaceId });
  res.json(docs);
});

// Get a single document
router.get('/view/:id', auth, async (req, res) => {
  const doc = await Document.findById(req.params.id);
  res.json(doc);
});

module.exports = router;
