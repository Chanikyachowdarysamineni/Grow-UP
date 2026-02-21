const express = require('express');
const {
  getUserNotes,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Note routes
router.get('/:userId', getUserNotes);
router.post('/:userId', auth, createNote);
router.put('/:noteId', auth, updateNote);
router.delete('/:noteId', auth, deleteNote);

module.exports = router;
