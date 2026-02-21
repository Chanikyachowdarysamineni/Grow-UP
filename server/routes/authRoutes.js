const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Auth routes (no auth required)
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);

module.exports = router;
