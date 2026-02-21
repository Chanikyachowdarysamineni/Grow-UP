const express = require('express');
const {
  getAllQuizzes,
  getQuiz,
  createQuiz,
  submitQuizAttempt,
  getUserQuizAttempts
} = require('../controllers/quizController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Quiz routes
router.get('/', getAllQuizzes);
router.get('/:quizId', getQuiz);
router.post('/', authMiddleware, createQuiz);
router.post('/:quizId/submit', authMiddleware, submitQuizAttempt);
router.get('/:quizId/attempts', authMiddleware, getUserQuizAttempts);

module.exports = router;
