const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['course', 'lesson'],
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  courseName: String,
  courseCategory: String,
  courseProgress: Number,
  courseDuration: String,
  courseRating: Number,
  lessonId: String,
  lessonTitle: String,
  lessonNumber: Number,
  notes: String,
  thumbnail: String,
  bookmarkedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);
