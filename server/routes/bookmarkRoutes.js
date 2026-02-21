const express = require('express');
const {
  getUserBookmarks,
  createBookmark,
  deleteBookmark
} = require('../controllers/bookmarkController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Bookmark routes
router.get('/:userId', getUserBookmarks);
router.post('/:userId', auth, createBookmark);
router.delete('/:bookmarkId', auth, deleteBookmark);

module.exports = router;
