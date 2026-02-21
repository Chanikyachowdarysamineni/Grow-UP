import React, { useState } from 'react';
import Navbar from '../components/Navbar';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  nextReview: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  dueCount: number;
  newCount: number;
  totalCount: number;
}

const Flashcards: React.FC = () => {
  const [decks] = useState<Deck[]>([
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      description: 'Core JavaScript concepts and syntax',
      dueCount: 12,
      newCount: 5,
      totalCount: 50,
      cards: [
        {
          id: 'c1',
          front: 'What is closure in JavaScript?',
          back: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.',
          deckId: '1',
          nextReview: new Date(),
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0
        },
        {
          id: 'c2',
          front: 'What is the difference between let and var?',
          back: 'let is block-scoped and cannot be redeclared in the same scope, while var is function-scoped and can be redeclared.',
          deckId: '1',
          nextReview: new Date(),
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0
        },
        {
          id: 'c3',
          front: 'What is the purpose of async/await?',
          back: 'async/await provides a cleaner syntax for working with Promises, making asynchronous code look and behave more like synchronous code.',
          deckId: '1',
          nextReview: new Date(),
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0
        }
      ]
    },
    {
      id: '2',
      name: 'React Hooks',
      description: 'Master React Hooks and their usage',
      dueCount: 8,
      newCount: 3,
      totalCount: 30,
      cards: []
    },
    {
      id: '3',
      name: 'Python Data Structures',
      description: 'Lists, dictionaries, sets, and tuples',
      dueCount: 15,
      newCount: 10,
      totalCount: 45,
      cards: []
    }
  ]);

  const [studyMode, setStudyMode] = useState(false);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  const startStudying = (deck: Deck) => {
    if (deck.cards.length > 0) {
      setCurrentDeck(deck);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setStudyMode(true);
      setSessionStats({ again: 0, hard: 0, good: 0, easy: 0 });
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Spaced Repetition Algorithm (SM-2)
  const calculateNextInterval = (card: Flashcard, quality: number): Flashcard => {
    let { easeFactor, interval, repetitions } = card;

    if (quality >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions++;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return { ...card, interval, easeFactor, repetitions, nextReview };
  };

  const rateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentDeck || !currentDeck.cards[currentCardIndex]) return;

    const quality = { again: 0, hard: 2, good: 3, easy: 5 }[rating];
    // Calculate next review interval using SM-2 algorithm
    calculateNextInterval(currentDeck.cards[currentCardIndex], quality);

    // Update stats
    setSessionStats(prev => ({ ...prev, [rating]: prev[rating] + 1 }));

    // Move to next card
    if (currentCardIndex < currentDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // Session complete
      setStudyMode(false);
    }
  };

  const endSession = () => {
    setStudyMode(false);
  };

  if (studyMode && currentDeck) {
    const currentCard = currentDeck.cards[currentCardIndex];
    const cardsRemaining = currentDeck.cards.length - currentCardIndex;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm font-semibold">
                Card {currentCardIndex + 1} of {currentDeck.cards.length}
              </span>
              <span className="text-white text-sm">{cardsRemaining} remaining</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${((currentCardIndex + 1) / currentDeck.cards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 mb-6 min-h-[300px] flex items-center justify-center cursor-pointer transform transition-transform hover:scale-105"
            onClick={flipCard}
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                {isFlipped ? 'Answer' : 'Question'}
              </p>
              <p className="text-2xl text-gray-900 font-semibold">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
              {!isFlipped && (
                <p className="text-sm text-gray-400 mt-4">Click to reveal answer</p>
              )}
            </div>
          </div>

          {/* Rating Buttons */}
          {isFlipped && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              <button
                onClick={() => rateCard('again')}
                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
              >
                <div>Again</div>
                <div className="text-xs opacity-75">&lt;1m</div>
              </button>
              <button
                onClick={() => rateCard('hard')}
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
              >
                <div>Hard</div>
                <div className="text-xs opacity-75">&lt;6m</div>
              </button>
              <button
                onClick={() => rateCard('good')}
                className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                <div>Good</div>
                <div className="text-xs opacity-75">&lt;10m</div>
              </button>
              <button
                onClick={() => rateCard('easy')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold"
              >
                <div>Easy</div>
                <div className="text-xs opacity-75">4d</div>
              </button>
            </div>
          )}

          {/* Session Controls */}
          <button
            onClick={endSession}
            className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-semibold backdrop-blur"
          >
            End Session
          </button>
        </div>
      </div>
    );
  }

  // Deck Selection View
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Study with Spaced Repetition</h2>
          <p className="text-gray-600">Master concepts efficiently with scientifically-proven learning techniques</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => (
            <div key={deck.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{deck.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{deck.description}</p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due cards</span>
                  <span className="text-sm font-bold text-red-600">{deck.dueCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New cards</span>
                  <span className="text-sm font-bold text-blue-600">{deck.newCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total cards</span>
                  <span className="text-sm font-bold text-gray-900">{deck.totalCount}</span>
                </div>
              </div>

              <button
                onClick={() => startStudying(deck)}
                disabled={deck.cards.length === 0}
                className={`w-full py-3 rounded-lg font-semibold ${
                  deck.cards.length > 0
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {deck.cards.length > 0 ? 'Study Now' : 'Coming Soon'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
