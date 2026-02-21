const express = require('express');
const {
  getAllQuizzes,
  getQuiz,
  createQuiz,
  submitQuizAttempt,
  getUserQuizAttempts
} = require('../controllers/quizController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Quiz routes
router.get('/', getAllQuizzes);
router.get('/:quizId', getQuiz);
router.post('/', auth, createQuiz);
router.post('/:quizId/submit', auth, submitQuizAttempt);
router.get('/:quizId/attempts', auth, getUserQuizAttempts);

module.exports = router;
