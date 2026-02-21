const express = require('express');
const {
  getAllCourses,
  getCourse,
  createCourse,
  addLesson,
  enrollCourse,
  rateCourse
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Course routes
router.get('/', getAllCourses);
router.get('/:courseId', getCourse);
router.post('/', authMiddleware, createCourse);
router.post('/:courseId/lesson', authMiddleware, addLesson);
router.post('/:courseId/enroll', authMiddleware, enrollCourse);
router.post('/:courseId/rate', authMiddleware, rateCourse);

module.exports = router;
