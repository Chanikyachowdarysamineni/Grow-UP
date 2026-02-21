const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'Data Science', 'DevOps', 'Design'],
    default: 'Full Stack'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  thumbnail: String,
  duration: String,
  lessons: [{
    id: String,
    title: String,
    description: String,
    videoUrl: String,
    duration: String,
    order: Number,
    resources: [{
      name: String,
      url: String
    }]
  }],
  totalLessons: Number,
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
