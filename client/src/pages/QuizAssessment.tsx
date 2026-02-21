import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Question {
  id: string;
  type: 'multiple-choice' | 'coding' | 'true-false';
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  duration: number; // minutes
  passingScore: number;
  questions: Question[];
}

interface QuizAttempt {
  quizId: string;
  answers: { [questionId: string]: string | number };
  score: number;
  passed: boolean;
  completedAt: string;
}

const QuizAssessment: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [codingAnswer, setCodingAnswer] = useState('');
  const [codeOutput, setCodeOutput] = useState('');

  // Sample quiz data
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'React Hooks Fundamentals',
      description: 'Test your understanding of React Hooks including useState, useEffect, and custom hooks',
      courseId: 'react-101',
      courseName: 'React Fundamentals',
      duration: 30,
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What does the useState hook return?',
          options: [
            'A state variable',
            'A function to update state',
            'An array with state variable and setter function',
            'An object with state and methods'
          ],
          correctAnswer: 2,
          explanation: 'useState returns an array with two elements: the current state value and a function to update it.',
          points: 10
        },
        {
          id: 'q2',
          type: 'true-false',
          question: 'useEffect runs after every render by default.',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'True! useEffect runs after every render unless you provide a dependency array.',
          points: 10
        },
        {
          id: 'q3',
          type: 'coding',
          question: 'Write a custom hook called useCounter that returns count and increment function',
          code: `function useCounter(initialValue = 0) {
  // Your code here
}`,
          correctAnswer: `function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(count + 1);
  return { count, increment };
}`,
          explanation: 'A custom hook uses existing hooks to create reusable logic. This hook uses useState internally.',
          points: 20
        },
        {
          id: 'q4',
          type: 'multiple-choice',
          question: 'When should you use useCallback?',
          options: [
            'Always, for every function',
            'To memoize functions that are passed as dependencies',
            'Only in class components',
            'Never, it\'s deprecated'
          ],
          correctAnswer: 1,
          explanation: 'useCallback is useful for memoizing functions to prevent unnecessary re-renders, especially when passing callbacks to optimized child components.',
          points: 15
        },
        {
          id: 'q5',
          type: 'multiple-choice',
          question: 'What is the purpose of the dependency array in useEffect?',
          options: [
            'To list all variables used in the effect',
            'To control when the effect runs',
            'To prevent memory leaks',
            'It has no purpose'
          ],
          correctAnswer: 1,
          explanation: 'The dependency array tells React when to re-run the effect. The effect only runs when one of the dependencies changes.',
          points: 15
        }
      ]
    }
  ];

  useEffect(() => {
    // Load quiz
    const loadedQuiz = sampleQuizzes.find(q => q.id === quizId) || sampleQuizzes[0];
    setQuiz(loadedQuiz);
    setTimeLeft(loadedQuiz.duration * 60);

    // Load saved progress
    const savedAnswers = localStorage.getItem(`quiz-answers-${loadedQuiz.id}`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, [quizId, sampleQuizzes]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults, submitQuiz]);

  // Save answers
  useEffect(() => {
    if (quiz && Object.keys(answers).length > 0) {
      localStorage.setItem(`quiz-answers-${quiz.id}`, JSON.stringify(answers));
    }
  }, [answers, quiz]);

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setShowExplanation(false);
  };

  const runCode = async () => {
    if (!quiz) return;
    
    try {
      // Simulate code execution
      setCodeOutput('Code executed successfully!\nOutput: Function defined');
      
      // In real implementation, call backend API
      // const response = await fetch('http://localhost:5000/api/execute', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ language: 'javascript', code: codingAnswer })
      // });
    } catch (error) {
      setCodeOutput('Error: ' + error);
    }
  };

  const submitQuiz = useCallback(() => {
    if (!quiz) return;

    let totalScore = 0;
    let earnedPoints = 0;

    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
        earnedPoints += question.points;
      }
      totalScore += question.points;
    });

    const percentage = Math.round((earnedPoints / totalScore) * 100);
    setScore(percentage);
    setShowResults(true);

    // Save attempt
    const attempt: QuizAttempt = {
      quizId: quiz.id,
      answers,
      score: percentage,
      passed: percentage >= quiz.passingScore,
      completedAt: new Date().toISOString()
    };

    const attempts = JSON.parse(localStorage.getItem('quiz-attempts') || '[]');
    attempts.push(attempt);
    localStorage.setItem('quiz-attempts', JSON.stringify(attempts));

    // Clear saved answers
    localStorage.removeItem(`quiz-answers-${quiz.id}`);
  }, [quiz, answers]);

  const retakeQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
    setShowExplanation(false);
    if (quiz) {
      setTimeLeft(quiz.duration * 60);
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showResults ? (
          <>
            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
                <span className="text-sm text-gray-500">{currentQuestion.points} points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold mb-4">
                  {currentQuestion.type.replace('-', ' ').toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentQuestion.question}
                </h2>
              </div>

              {currentQuestion.type === 'coding' && (
                <div className="mb-6">
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <pre className="text-green-400 text-sm font-mono">{currentQuestion.code}</pre>
                  </div>
                  <textarea
                    value={codingAnswer}
                    onChange={(e) => setCodingAnswer(e.target.value)}
                    placeholder="Write your code here..."
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="flex items-center space-x-4 mt-4">
                    <button
                      onClick={runCode}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    >
                      ▶ Run Code
                    </button>
                    {codeOutput && (
                      <div className="flex-1 bg-gray-100 rounded-lg p-3">
                        <pre className="text-sm text-gray-800">{codeOutput}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(currentQuestion.id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        answers[currentQuestion.id] === index
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion.id] === index
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion.id] === index && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-900 font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Show Answer Button (for practice mode) */}
              {!showExplanation && (
                <button
                  onClick={() => setShowExplanation(true)}
                  className="mt-6 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                >
                  💡 Show Explanation
                </button>
              )}

              {showExplanation && (
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Explanation:</p>
                  <p className="text-sm text-blue-800">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <button
                    onClick={submitQuiz}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Results */
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 ${
                score >= quiz.passingScore ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {score >= quiz.passingScore ? (
                  <svg className="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-16 h-16 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {score >= quiz.passingScore ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}
              </h2>
              <p className="text-gray-600 mb-6">
                {score >= quiz.passingScore 
                  ? 'You passed the quiz!' 
                  : `You need ${quiz.passingScore}% to pass. You got ${score}%`}
              </p>

              <div className="text-6xl font-bold text-indigo-600 mb-2">{score}%</div>
              <p className="text-gray-500">Your Score</p>
            </div>

            {/* Score Breakdown */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Score Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.keys(answers).filter(qId => answers[qId] === quiz.questions.find(q => q.id === qId)?.correctAnswer).length}
                  </p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {quiz.questions.length - Object.keys(answers).filter(qId => answers[qId] === quiz.questions.find(q => q.id === qId)?.correctAnswer).length}
                  </p>
                  <p className="text-sm text-gray-600">Incorrect</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{quiz.questions.length}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={retakeQuiz}
                className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50"
              >
                Retake Quiz
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAssessment;
