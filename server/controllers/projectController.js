const Project = require('../models/Project');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) filter.status = status;

    const projects = await Project.find(filter)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user's projects
exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('userId', 'name avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Submit project
exports.submitProject = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description, sourceCode, liveLink, technologies, rubric } = req.body;

    const project = new Project({
      userId,
      title,
      description,
      sourceCode,
      liveLink,
      technologies,
      rubric,
      submissionDate: new Date(),
      status: 'submitted'
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully',
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Review project
exports.reviewProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { score, feedback, status } = req.body;

    let project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.score = score;
    project.feedback = feedback;
    project.status = status || 'reviewed';
    project.reviewDate = new Date();

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project reviewed successfully',
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
