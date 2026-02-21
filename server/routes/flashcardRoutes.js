const express = require('express');
const {
  getUserDecks,
  createDeck,
  addFlashcard,
  updateFlashcard,
  getCardsDueForReview
} = require('../controllers/flashcardController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Flashcard routes
router.get('/:userId/decks', getUserDecks);
router.post('/:userId/deck', authMiddleware, createDeck);
router.post('/:deckId/card', authMiddleware, addFlashcard);
router.put('/:flashcardId', authMiddleware, updateFlashcard);
router.get('/:deckId/due', authMiddleware, getCardsDueForReview);

module.exports = router;
