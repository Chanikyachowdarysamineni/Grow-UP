const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  awardBadge
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// User profile routes
router.get('/:userId', getUserProfile);
router.put('/:userId', authMiddleware, updateUserProfile);

// Badge routes
router.post('/:userId/badge', authMiddleware, awardBadge);

module.exports = router;
