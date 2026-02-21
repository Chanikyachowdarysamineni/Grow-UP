const express = require('express');
const {
  getAllCourses,
  getCourse,
  createCourse,
  addLesson,
  enrollCourse,
  rateCourse
} = require('../controllers/courseController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Course routes
router.get('/', getAllCourses);
router.get('/:courseId', getCourse);
router.post('/', auth, createCourse);
router.post('/:courseId/lesson', auth, addLesson);
router.post('/:courseId/enroll', auth, enrollCourse);
router.post('/:courseId/rate', auth, rateCourse);

module.exports = router;
