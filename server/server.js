const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const { getEnv } = require('./config/env');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api/flashcards', require('./routes/flashcardRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/ai-tutor', require('./routes/aiTutorRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = getEnv('PORT') || 5000;
const server = app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║                  🚀 SERVER RUNNING 🚀                      ║
    ║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━║
    ║  Server: http://localhost:${PORT}                          ║
    ║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
    ║  Database: Connected to MongoDB                             ║
    ║════════════════════════════════════════════════════════════╝
  `);
});

// Socket.io setup for real-time features
const http = require('http');
const socketIO = require('socket.io');

const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.io event handlers
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket.io] User connected: ${socket.id}`);

  // User comes online
  socket.on('user-online', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('user-status', {
      userId,
      status: 'online',
      onlineCount: onlineUsers.size
    });
    console.log(`[Socket.io] User online: ${userId}`);
  });

  // Send private message
  socket.on('send-message', (data) => {
    const { conversationId, recipientId, message } = data;
    io.emit('message-received', {
      conversationId,
      recipientId,
      message,
      timestamp: new Date()
    });
    console.log(`[Socket.io] Message sent in conversation: ${conversationId}`);
  });

  // Forum notification
  socket.on('thread-reply', (data) => {
    const { threadId, threadTitle } = data;
    io.emit('forum-notification', {
      type: 'new-reply',
      threadId,
      threadTitle,
      message: `New reply on "${threadTitle}"`
    });
    console.log(`[Socket.io] New reply on thread: ${threadId}`);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { conversationId, userId, isTyping } = data;
    io.emit('user-typing', {
      conversationId,
      userId,
      isTyping
    });
  });

  // Course progress update
  socket.on('progress-update', (data) => {
    const { userId, courseId, completionPercentage } = data;
    io.emit('progress-changed', {
      userId,
      courseId,
      completionPercentage,
      timestamp: new Date()
    });
    console.log(`[Socket.io] Progress updated: ${userId} - ${courseId}`);
  });

  // Quiz submission
  socket.on('quiz-submitted', (data) => {
    const { userId, quizId, score, passed } = data;
    io.emit('quiz-completed', {
      userId,
      quizId,
      score,
      passed,
      timestamp: new Date()
    });
    console.log(`[Socket.io] Quiz submitted: ${quizId} by ${userId}`);
  });

  // User goes offline
  socket.on('disconnect', () => {
    let disconnectedUserId = null;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      io.emit('user-status', {
        userId: disconnectedUserId,
        status: 'offline',
        onlineCount: onlineUsers.size
      });
      console.log(`[Socket.io] User offline: ${disconnectedUserId}`);
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`[Socket.io] Error: ${error}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
