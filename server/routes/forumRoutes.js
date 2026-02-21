const express = require('express');
const {
  getForumThreads,
  getThread,
  createThread,
  addReply,
  upvoteReply,
  markAsSolution
} = require('../controllers/forumController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Forum routes
router.get('/', getForumThreads);
router.get('/:threadId', getThread);
router.post('/', authMiddleware, createThread);
router.post('/:threadId/reply', authMiddleware, addReply);
router.put('/:threadId/reply/:replyId/upvote', authMiddleware, upvoteReply);
router.put('/:threadId/reply/:replyId/solution', authMiddleware, markAsSolution);

module.exports = router;
