const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  courseName: String,
  duration: {
    type: Number,
    default: 30 // in minutes
  },
  passingScore: {
    type: Number,
    default: 70
  },
  questions: [{
    id: String,
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'coding', 'short-answer']
    },
    question: String,
    code: String,
    options: [String],
    correctAnswer: mongoose.Schema.Types.Mixed,
    explanation: String,
    points: Number,
    order: Number
  }],
  attempts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    answers: mongoose.Schema.Types.Mixed,
    score: Number,
    passed: Boolean,
    completedAt: Date
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

module.exports = mongoose.model('Quiz', quizSchema);
