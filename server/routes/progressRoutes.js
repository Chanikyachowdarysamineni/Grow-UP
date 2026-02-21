const express = require('express');
const {
  getUserProgress,
  updateCourseProgress,
  completeCourse
} = require('../controllers/progressController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Progress routes
router.get('/user/:userId', getUserProgress);
router.put('/:userId/course/:courseId', auth, updateCourseProgress);
router.post('/:userId/course/:courseId/complete', auth, completeCourse);

module.exports = router;
