const express = require('express');
const {
  getAIConversations,
  getConversation,
  startConversation,
  sendMessage,
  getLearningsuggestions
} = require('../controllers/aiTutorController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// AI Tutor routes
router.get('/:userId/conversations', auth, getAIConversations);
router.get('/:conversationId', auth, getConversation);
router.post('/:userId/start', auth, startConversation);
router.post('/:conversationId/message', auth, sendMessage);
router.get('/:userId/suggestions', auth, getLearningsuggestions);

module.exports = router;
