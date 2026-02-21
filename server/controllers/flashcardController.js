const Flashcard = require('../models/Flashcard');
const Deck = require('../models/Deck');

// Get user decks
exports.getUserDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ userId: req.params.userId })
      .populate('cards')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      decks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create deck
exports.createDeck = async (req, res) => {
  try {
    const { userId } = req.params;
    const { deckName, description, subject } = req.body;

    const deck = new Deck({
      userId,
      deckName,
      description,
      subject,
      cards: []
    });

    await deck.save();

    res.status(201).json({
      success: true,
      message: 'Deck created successfully',
      deck
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add flashcard to deck
exports.addFlashcard = async (req, res) => {
  try {
    const { deckId } = req.params;
    const { question, answer } = req.body;

    const flashcard = new Flashcard({
      deckId,
      question,
      answer,
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0
    });

    await flashcard.save();

    let deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found'
      });
    }

    deck.cards.push(flashcard._id);
    await deck.save();

    res.status(201).json({
      success: true,
      message: 'Flashcard added successfully',
      flashcard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update flashcard (SuperMemo 2 algorithm)
exports.updateFlashcard = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const { quality } = req.body; // 0-5 quality rating

    let card = await Flashcard.findById(flashcardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }

    // SuperMemo 2 algorithm
    if (quality < 3) {
      card.repetitions = 0;
      card.interval = 1;
    } else {
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 3;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }
      card.repetitions += 1;
    }

    card.easeFactor = Math.max(
      1.3,
      card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    card.lastReview = new Date();
    card.nextReview = new Date(Date.now() + card.interval * 24 * 60 * 60 * 1000);

    await card.save();

    res.status(200).json({
      success: true,
      message: 'Flashcard updated successfully',
      card
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get cards due for review
exports.getCardsDueForReview = async (req, res) => {
  try {
    const { deckId } = req.params;

    const cards = await Flashcard.find({
      deckId,
      $or: [
        { nextReview: { $lt: new Date() } },
        { nextReview: { $exists: false } }
      ]
    });

    res.status(200).json({
      success: true,
      cards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
