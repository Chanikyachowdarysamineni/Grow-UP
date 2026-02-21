const express = require('express');
const {
  getAllProjects,
  getUserProjects,
  getProject,
  submitProject,
  reviewProject
} = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Project routes
router.get('/', getAllProjects);
router.get('/user/:userId', getUserProjects);
router.get('/:projectId', getProject);
router.post('/:userId/submit', authMiddleware, submitProject);
router.put('/:projectId/review', authMiddleware, reviewProject);

module.exports = router;
