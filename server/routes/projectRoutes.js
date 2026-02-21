const express = require('express');
const {
  getAllProjects,
  getUserProjects,
  getProject,
  submitProject,
  reviewProject
} = require('../controllers/projectController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Project routes
router.get('/', getAllProjects);
router.get('/user/:userId', getUserProjects);
router.get('/:projectId', getProject);
router.post('/:userId/submit', auth, submitProject);
router.put('/:projectId/review', auth, reviewProject);

module.exports = router;
