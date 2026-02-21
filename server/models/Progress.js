const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [String],
  currentLesson: String,
  timeSpent: {
    type: Number,
    default: 0 // in minutes
  },
  certificateEarned: {
    type: Boolean,
    default: false
  },
  certificateDate: Date,
  certificateNumber: String,
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  quizScores: [{
    quizId: String,
    score: Number,
    totalQuestions: Number,
    attemptDate: Date
  }],
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActiveDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Progress || mongoose.model('Progress', progressSchema);
