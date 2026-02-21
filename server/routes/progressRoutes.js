const express = require('express');
const {
  getUserProgress,
  updateCourseProgress,
  completeCourse
} = require('../controllers/progressController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Progress routes
router.get('/user/:userId', getUserProgress);
router.put('/:userId/course/:courseId', authMiddleware, updateCourseProgress);
router.post('/:userId/course/:courseId/complete', authMiddleware, completeCourse);

module.exports = router;
