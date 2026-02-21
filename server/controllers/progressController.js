const Progress = require('../models/Progress');
const Course = require('../models/Course');

// Get user progress
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId })
      .populate('courseId', 'title thumbnail category');

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update course progress
exports.updateCourseProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId, completedLesson, timeSpent } = req.body;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLessons: [],
        timeSpent: 0
      });
    }

    // Add completed lesson
    if (completedLesson && !progress.completedLessons.includes(completedLesson)) {
      progress.completedLessons.push(completedLesson);
    }

    // Update time spent
    if (timeSpent) {
      progress.timeSpent += timeSpent;
    }

    // Calculate completion percentage
    const course = await Course.findById(courseId);
    if (course) {
      progress.completionPercentage = Math.round(
        (progress.completedLessons.length / course.lessons.length) * 100
      );
    }

    progress.lastAccessed = new Date();
    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Complete course
exports.completeCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }

    progress.completionPercentage = 100;
    progress.certificateEarned = true;
    progress.certificateDate = new Date();
    progress.certificateNumber = `CERT-${userId}-${courseId}-${Date.now()}`;
    progress.completedAt = new Date();

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Course completed successfully',
      progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
