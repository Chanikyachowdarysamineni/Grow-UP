const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  front: {
    type: String,
    required: true
  },
  back: {
    type: String,
    required: true
  },
  nextReview: {
    type: Date,
    default: Date.now
  },
  interval: {
    type: Number,
    default: 0
  },
  easeFactor: {
    type: Number,
    default: 2.5
  },
  repetitions: {
    type: Number,
    default: 0
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

const deckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flashcard'
    }
  ],
  dueCount: {
    type: Number,
    default: 0
  },
  newCount: {
    type: Number,
    default: 0
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

module.exports = {
  Flashcard: mongoose.model('Flashcard', flashcardSchema),
  Deck: mongoose.model('Deck', deckSchema)
};
