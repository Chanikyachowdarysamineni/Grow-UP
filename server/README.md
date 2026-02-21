# Grow Up - Backend Server

A comprehensive REST API and real-time server for the Grow Up online learning platform.

## 🚀 Features

- **Authentication**: JWT-based user authentication with role-based access control
- **Course Management**: Create, manage, and enroll in courses with lesson tracking
- **Progress Tracking**: Monitor learning progress, completion percentages, and certificates
- **Learning Tools**: Notes, bookmarks, flashcards with spaced repetition (SuperMemo 2)
- **Community Features**: Forums, discussions, private messaging
- **Assessment System**: Quizzes, projects with rubric-based evaluation
- **AI Tutoring**: AI-powered learning assistant and suggestions
- **Real-time Updates**: WebSocket support via Socket.io for live notifications

## 📋 Prerequisites

- **Node.js** (v14+)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/grow-up
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
Update `MONGODB_URI` in `.env` with your connection string.

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run at: `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer {token}
```

### User Profile Endpoints

#### Get User Profile
```
GET /users/:userId
```

#### Update User Profile
```
PUT /users/:userId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "Learning enthusiast",
  "skills": ["JavaScript", "React"],
  "learningGoals": ["Master Web Development"]
}
```

#### Award Badge
```
POST /users/:userId/badge
Authorization: Bearer {token}
Content-Type: application/json

{
  "badgeId": "badge_123",
  "badgeName": "First Course",
  "badgeIcon": "url_to_icon",
  "badgeDescription": "Completed your first course"
}
```

### Course Endpoints

#### Get All Courses
```
GET /courses
GET /courses?category=programming&level=beginner&search=javascript
```

#### Get Single Course
```
GET /courses/:courseId
```

#### Create Course
```
POST /courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "JavaScript Basics",
  "description": "Learn JavaScript from scratch",
  "category": "programming",
  "level": "beginner",
  "thumbnail": "url_to_thumbnail"
}
```

#### Add Lesson to Course
```
POST /courses/:courseId/lesson
Authorization: Bearer {token}
Content-Type: application/json

{
  "lessonTitle": "Variables and Data Types",
  "lessonNumber": 1,
  "lessonContent": "lesson_content_here",
  "videoDuration": 1200
}
```

#### Enroll in Course
```
POST /courses/:courseId/enroll
Authorization: Bearer {token}
```

#### Rate Course
```
POST /courses/:courseId/rate
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "review": "Great course!"
}
```

### Progress Endpoints

#### Get User Progress
```
GET /progress/user/:userId
```

#### Update Course Progress
```
PUT /progress/:userId/course/:courseId
Authorization: Bearer {token}
Content-Type: application/json

{
  "completedLesson": "lesson_id",
  "timeSpent": 3600
}
```

#### Complete Course
```
POST /progress/:userId/course/:courseId/complete
Authorization: Bearer {token}
```

### Notes Endpoints

#### Get User Notes
```
GET /notes/:userId
```

#### Create Note
```
POST /notes/:userId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Note Title",
  "content": "Note content here",
  "courseId": "course_id",
  "courseName": "Course Name",
  "lessonName": "Lesson Name",
  "tags": ["tag1", "tag2"],
  "color": "yellow"
}
```

#### Update Note
```
PUT /notes/:noteId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "color": "green",
  "highlighted": true
}
```

#### Delete Note
```
DELETE /notes/:noteId
Authorization: Bearer {token}
```

### Bookmark Endpoints

#### Get User Bookmarks
```
GET /bookmarks/:userId
```

#### Create Bookmark
```
POST /bookmarks/:userId
Authorization: Bearer {token}
Content-Type: application/json

{
  "resourceType": "course",
  "resourceId": "course_id",
  "resourceTitle": "Course Title",
  "category": "Programming"
}
```

#### Delete Bookmark
```
DELETE /bookmarks/:bookmarkId
Authorization: Bearer {token}
```

### Forum Endpoints

#### Get All Threads
```
GET /forum
GET /forum?category=javascript
```

#### Get Single Thread
```
GET /forum/:threadId
```

#### Create Thread
```
POST /forum
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "How to learn JavaScript?",
  "content": "I'm new to programming...",
  "category": "javascript",
  "tags": ["beginner", "learning"]
}
```

#### Add Reply
```
POST /forum/:threadId/reply
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "You should start with..."
}
```

#### Upvote Reply
```
PUT /forum/:threadId/reply/:replyId/upvote
Authorization: Bearer {token}
```

#### Mark as Solution
```
PUT /forum/:threadId/reply/:replyId/solution
Authorization: Bearer {token}
```

### Conversation Endpoints

#### Get All Conversations
```
GET /conversations
Authorization: Bearer {token}
```

#### Get Single Conversation
```
GET /conversations/:conversationId
Authorization: Bearer {token}
```

#### Start Conversation
```
POST /conversations/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipientId": "user_id"
}
```

#### Send Message
```
POST /conversations/:conversationId/message
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Message content here"
}
```

#### Mark Message as Read
```
PUT /conversations/:conversationId/message/:messageId/read
Authorization: Bearer {token}
```

### Flashcard Endpoints

#### Get User Decks
```
GET /flashcards/:userId/decks
```

#### Create Deck
```
POST /flashcards/:userId/deck
Authorization: Bearer {token}
Content-Type: application/json

{
  "deckName": "Spanish Vocabulary",
  "description": "Common Spanish words",
  "subject": "Languages"
}
```

#### Add Flashcard
```
POST /flashcards/:deckId/card
Authorization: Bearer {token}
Content-Type: application/json

{
  "question": "What is the Spanish word for 'hello'?",
  "answer": "Hola"
}
```

#### Update Flashcard (SuperMemo 2)
```
PUT /flashcards/:flashcardId
Authorization: Bearer {token}
Content-Type: application/json

{
  "quality": 4
}
```

#### Get Cards Due for Review
```
GET /flashcards/:deckId/due
Authorization: Bearer {token}
```

### Quiz Endpoints

#### Get All Quizzes
```
GET /quizzes
```

#### Get Single Quiz
```
GET /quizzes/:quizId
```

#### Create Quiz
```
POST /quizzes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "JavaScript Fundamentals",
  "description": "Test your JS knowledge",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What is JavaScript?",
      "options": ["A scripting language", "A framework", "A database"],
      "correctAnswer": 0
    }
  ],
  "passingScore": 70,
  "timeLimit": 3600
}
```

#### Submit Quiz
```
POST /quizzes/:quizId/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": [0, 1, 2],
  "timeSpent": 1800
}
```

#### Get User's Quiz Attempts
```
GET /quizzes/:quizId/attempts
Authorization: Bearer {token}
```

### Project Endpoints

#### Get All Projects
```
GET /projects
GET /projects?status=submitted
```

#### Get User's Projects
```
GET /projects/user/:userId
```

#### Get Single Project
```
GET /projects/:projectId
```

#### Submit Project
```
POST /projects/:userId/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Todo App",
  "description": "A simple todo application",
  "sourceCode": "https://github.com/user/repo",
  "liveLink": "https://app.example.com",
  "technologies": ["React", "Node.js", "MongoDB"],
  "rubric": { "criterion": "points" }
}
```

#### Review Project
```
PUT /projects/:projectId/review
Authorization: Bearer {token}
Content-Type: application/json

{
  "score": 85,
  "feedback": "Great work!",
  "status": "approved"
}
```

### AI Tutor Endpoints

#### Get AI Conversations
```
GET /ai-tutor/:userId/conversations
Authorization: Bearer {token}
```

#### Get Single Conversation
```
GET /ai-tutor/:conversationId
Authorization: Bearer {token}
```

#### Start AI Conversation
```
POST /ai-tutor/:userId/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "subject": "JavaScript",
  "topic": "Async/Await"
}
```

#### Send Message to AI Tutor
```
POST /ai-tutor/:conversationId/message
Authorization: Bearer {token}
Content-Type: application/json

{
  "userMessage": "Explain async/await"
}
```

#### Get Learning Suggestions
```
GET /ai-tutor/:userId/suggestions
Authorization: Bearer {token}
```

## 🔌 Real-time Events (Socket.io)

### Client Events

```javascript
// User comes online
socket.emit('user-online', userId);

// Send private message
socket.emit('send-message', {
  conversationId,
  recipientId,
  message
});

// New thread reply
socket.emit('thread-reply', {
  threadId,
  threadTitle
});

// Typing indicator
socket.emit('typing', {
  conversationId,
  userId,
  isTyping: true
});

// Course progress update
socket.emit('progress-update', {
  userId,
  courseId,
  completionPercentage
});

// Quiz submission
socket.emit('quiz-submitted', {
  userId,
  quizId,
  score,
  passed
});
```

### Server Events (Listen)

```javascript
// User status change
socket.on('user-status', (data) => {
  // { userId, status: 'online'|'offline', onlineCount }
});

// Message received
socket.on('message-received', (data) => {
  // { conversationId, recipientId, message, timestamp }
});

// Forum notification
socket.on('forum-notification', (data) => {
  // { type, threadId, threadTitle, message }
});

// User typing
socket.on('user-typing', (data) => {
  // { conversationId, userId, isTyping }
});

// Progress changed
socket.on('progress-changed', (data) => {
  // { userId, courseId, completionPercentage, timestamp }
});

// Quiz completed
socket.on('quiz-completed', (data) => {
  // { userId, quizId, score, passed, timestamp }
});
```

## 🗄️ Database Models

The backend uses **MongoDB** with the following collections:

1. **Users** - User accounts, profiles, badges, learning goals
2. **Courses** - Course info, lessons, instructors, enrollments
3. **Progress** - Learning progress, completion, certificates
4. **Notes** - User notes with color coding and tags
5. **Bookmarks** - Bookmarked courses and lessons
6. **ForumThreads** - Discussion threads with replies
7. **Conversations** - Private messages between users
8. **Flashcards** - Spaced repetition cards
9. **Decks** - Flashcard collections
10. **Quizzes** - Assessment questions and attempts
11. **Projects** - Project submissions with rubrics
12. **AIConversations** - AI tutor chat history

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token is obtained from `/auth/register` or `/auth/login`.

## 📝 Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

Add test commands in `package.json` and create test files in a `tests/` directory.

## 📦 Deployment

### Heroku

```bash
# Install Heroku CLI
# heroku login
# heroku create grow-up-server
# heroku config:set MONGODB_URI=your_atlas_uri
# git push heroku main
```

### Docker

Create a `Dockerfile` and `docker-compose.yml` for containerized deployment.

## 📧 Support

For issues or questions, contact the development team.

## 📄 License

MIT License

---

**Happy Learning!** 🚀
