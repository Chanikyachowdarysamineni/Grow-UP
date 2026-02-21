const express = require('express');
const {
  getForumThreads,
  getThread,
  createThread,
  addReply,
  upvoteReply,
  markAsSolution
} = require('../controllers/forumController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Forum routes
router.get('/', getForumThreads);
router.get('/:threadId', getThread);
router.post('/', auth, createThread);
router.post('/:threadId/reply', auth, addReply);
router.put('/:threadId/reply/:replyId/upvote', auth, upvoteReply);
router.put('/:threadId/reply/:replyId/solution', auth, markAsSolution);

module.exports = router;
