const express = require('express');
const {
  getUserBookmarks,
  createBookmark,
  deleteBookmark
} = require('../controllers/bookmarkController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Bookmark routes
router.get('/:userId', getUserBookmarks);
router.post('/:userId', authMiddleware, createBookmark);
router.delete('/:bookmarkId', authMiddleware, deleteBookmark);

module.exports = router;
