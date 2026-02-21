const express = require('express');
const {
  getAIConversations,
  getConversation,
  startConversation,
  sendMessage,
  getLearningsuggestions
} = require('../controllers/aiTutorController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// AI Tutor routes
router.get('/:userId/conversations', authMiddleware, getAIConversations);
router.get('/:conversationId', authMiddleware, getConversation);
router.post('/:userId/start', authMiddleware, startConversation);
router.post('/:conversationId/message', authMiddleware, sendMessage);
router.get('/:userId/suggestions', authMiddleware, getLearningsuggestions);

module.exports = router;
