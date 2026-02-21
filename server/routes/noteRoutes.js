const express = require('express');
const {
  getUserNotes,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Note routes
router.get('/:userId', getUserNotes);
router.post('/:userId', authMiddleware, createNote);
router.put('/:noteId', authMiddleware, updateNote);
router.delete('/:noteId', authMiddleware, deleteNote);

module.exports = router;
