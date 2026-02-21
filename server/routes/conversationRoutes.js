const express = require('express');
const {
  getUserConversations,
  getConversation,
  startConversation,
  sendMessage,
  markAsRead
} = require('../controllers/conversationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Message routes
router.get('/', authMiddleware, getUserConversations);
router.get('/:conversationId', authMiddleware, getConversation);
router.post('/start', authMiddleware, startConversation);
router.post('/:conversationId/message', authMiddleware, sendMessage);
router.put('/:conversationId/message/:messageId/read', authMiddleware, markAsRead);

module.exports = router;
