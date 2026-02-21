const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  awardBadge
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// User profile routes
router.get('/:userId', getUserProfile);
router.put('/:userId', auth, updateUserProfile);

// Badge routes
router.post('/:userId/badge', auth, awardBadge);

module.exports = router;
