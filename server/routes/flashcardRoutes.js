const express = require('express');
const {
  getUserDecks,
  createDeck,
  addFlashcard,
  updateFlashcard,
  getCardsDueForReview
} = require('../controllers/flashcardController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Flashcard routes
router.get('/:userId/decks', getUserDecks);
router.post('/:userId/deck', auth, createDeck);
router.post('/:deckId/card', auth, addFlashcard);
router.put('/:flashcardId', auth, updateFlashcard);
router.get('/:deckId/due', auth, getCardsDueForReview);

module.exports = router;
