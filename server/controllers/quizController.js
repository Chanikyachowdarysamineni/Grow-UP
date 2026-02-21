const Quiz = require('../models/Quiz');

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single quiz
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate('createdBy', 'name avatar');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions, passingScore, timeLimit } = req.body;

    const quiz = new Quiz({
      title,
      description,
      questions,
      passingScore,
      timeLimit,
      createdBy: req.userId,
      attempts: []
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Submit quiz attempt
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, timeSpent } = req.body;

    let quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (quiz.questions[index] && quiz.questions[index].correctAnswer === answer) {
        correctAnswers += 1;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const attempt = {
      userId: req.userId,
      answers,
      score,
      passed,
      timeSpent,
      attemptDate: new Date()
    };

    quiz.attempts.push(attempt);
    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      attempt: {
        ...attempt,
        totalQuestions: quiz.questions.length,
        correctAnswers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user's quiz attempts
exports.getUserQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const attempts = quiz.attempts.filter(
      attempt => attempt.userId.toString() === req.userId
    );

    res.status(200).json({
      success: true,
      attempts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
