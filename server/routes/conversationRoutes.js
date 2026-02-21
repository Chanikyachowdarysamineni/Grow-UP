const express = require('express');
const {
  getUserConversations,
  getConversation,
  startConversation,
  sendMessage,
  markAsRead
} = require('../controllers/conversationController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Message routes
router.get('/', auth, getUserConversations);
router.get('/:conversationId', auth, getConversation);
router.post('/start', auth, startConversation);
router.post('/:conversationId/message', auth, sendMessage);
router.put('/:conversationId/message/:messageId/read', auth, markAsRead);

module.exports = router;
