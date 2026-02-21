const Course = require('../models/Course');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructorId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('instructorId', 'name bio avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level, thumbnail } = req.body;

    const course = new Course({
      title,
      description,
      category,
      level,
      thumbnail,
      instructorId: req.userId,
      lessons: [],
      students: [],
      rating: 0
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add lesson to course
exports.addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonTitle, lessonNumber, lessonContent, videoDuration } = req.body;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Verify instructor
    if (course.instructorId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course'
      });
    }

    course.lessons.push({
      title: lessonTitle,
      lessonNumber,
      content: lessonContent,
      videoDuration
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Lesson added successfully',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Enroll in course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    if (course.students.includes(req.userId)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    course.students.push(req.userId);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Enrolled in course successfully',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Rate course
exports.rateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, review } = req.body;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Add review
    course.reviews.push({
      userId: req.userId,
      rating,
      review,
      createdAt: new Date()
    });

    // Calculate average rating
    const totalRating = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    course.rating = Math.round((totalRating / course.reviews.length) * 10) / 10;

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Review submitted successfully',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
