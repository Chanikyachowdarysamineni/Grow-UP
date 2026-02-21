const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    deckName: {
      type: String,
      required: [true, 'Please provide a deck name'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject']
    },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flashcard'
      }
    ],
    totalCards: {
      type: Number,
      default: 0
    },
    newCards: {
      type: Number,
      default: 0
    },
    reviewCards: {
      type: Number,
      default: 0
    },
    learningCards: {
      type: Number,
      default: 0
    },
    studyStreak: {
      type: Number,
      default: 0
    },
    lastStudied: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Deck', deckSchema);
