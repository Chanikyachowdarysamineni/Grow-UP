const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
  dueDate: Date,
  maxScore: {
    type: Number,
    default: 100
  },
  requirements: [String],
  submissionTypes: {
    type: [String],
    enum: ['code', 'file', 'url'],
    default: ['code', 'url', 'file']
  },
  submissions: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    files: [{
      name: String,
      size: Number,
      type: String,
      url: String
    }],
    codeUrl: String,
    liveUrl: String,
    notes: String,
    submittedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'needsRevision'],
      default: 'pending'
    },
    score: Number,
    feedback: String,
    feedbackDate: Date
  }],
  rubric: [{
    criteria: String,
    maxPoints: Number,
    description: String
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

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
