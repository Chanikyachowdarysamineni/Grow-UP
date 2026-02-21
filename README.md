# Grow Up - Real-Time Learning Platform

A modern, real-time online learning platform with live messaging, forums, and progress tracking.

## 🚀 Features

### Real-Time Features
- **Live Messaging** - Chat with instructors and students in real-time using WebSocket
- **Discussion Forums** - Real-time thread updates and notifications
- **Online Status** - See who's online instantly
- **Typing Indicators** - Know when someone is typing

### User Features
- **User Profiles** - Customizable avatars, bio, skills, and learning goals
- **Progress Tracking** - Track course completion, earn certificates, maintain streaks
- **Bookmarks** - Save courses and lessons for later
- **Notes System** - Take color-coded notes with tags and highlighting
- **Code Editor** - Multi-language code execution environment

### Authentication
- User registration and login
- Session management
- Protected routes

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Chanikyachowdarysamineni/Grow-UP.git
cd Grow-UP
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

## 🏃 Running the Application

### Option 1: Manual Start (Recommended for Development)

#### Start Backend Server (Port 5000)
```bash
cd server
node realtime-server.js
```

#### Start Frontend (Port 3000) - In a new terminal
```bash
cd client
npm start
```

### Option 2: Quick Start Script

#### Windows
```powershell
.\start-all.ps1
```

#### Linux/Mac
```bash
chmod +x start-all.sh
./start-all.sh
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update profile

### Progress Tracking
- `GET /api/progress/:userId` - Get user progress
- `PUT /api/progress/:userId` - Update progress
- `POST /api/progress/:userId/course` - Update course progress

### Bookmarks
- `GET /api/Bookmarks/:userId` - Get bookmarks
- `POST /api/bookmarks/:userId` - Add bookmark
- `DELETE /api/bookmarks/:userId/:type/:itemId` - Remove bookmark

### Notes
- `GET /api/notes/:userId` - Get all notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:noteId` - Update note
- `DELETE /api/notes/:noteId` - Delete note

### Forums
- `GET /api/forums/threads` - Get all threads
- `GET /api/forums/threads/:threadId` - Get thread with replies
- `POST /api/forums/threads` - Create thread
- `POST /api/forums/threads/:threadId/replies` - Add reply
- `POST /api/forums/:itemId/upvote` - Upvote thread or reply
- `POST /api/forums/replies/:replyId/accept` - Accept reply as answer

### Messages
- `GET /api/messages/conversations/:userId` - Get conversations
- `GET /api/messages/:conversationId` - Get messages
- `POST /api/messages/conversation` - Create conversation
- `POST /api/messages` - Send message
- `PUT /api/messages/:messageId/read` - Mark as read

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:courseId` - Get course details

### Code Execution
- `POST /api/execute` - Execute code (supports Python, JavaScript, Java, etc.)

## 🔌 WebSocket Events

### Client → Server
- `user:online` - User comes online
- `message:send` - Send a message
- `forum:new-thread` - Create forum thread
- `forum:new-reply` - Add forum reply
- `forum:upvote` - Upvote content
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server → Client
- `user:status` - User online/offline status update
- `message:receive` - Receive new message
- `message:sent` - Message delivery confirmation
- `forum:thread-created` - New thread notification
- `forum:reply-added` - New reply notification
- `forum:upvoted` - Upvote notification
- `typing:update` - Typing indicator update

## 💾 Data Storage

Currently uses **in-memory storage** for demonstration purposes. In production, replace with:
- MongoDB for document storage
- PostgreSQL for relational data
- Redis for caching and session management

## 🔒 Security Notes

⚠️ **Development Mode Only**
- Passwords are stored in plain text (use bcrypt in production)
- No JWT authentication (implement for production)
- CORS is wide open (restrict in production)
- No rate limiting (add in production)

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- React Router v6
- Socket.io Client
- Tailwind CS
- Axios

### Backend
- Node.js with Express
- Socket.io for real-time communication
- In-memory data store (replace with database)
- Code execution environment

## 📱 Features Overview

### Dashboard
- Quick stats overview
- Recent activities
- Course progress tracking
- Quick access to all features

### Code Editor
- Multi-language support (Python, JavaScript, Java, C++, Go, Rust, etc.)
- Real-time code execution
- Syntax highlighting
- Output console
- File management

### Learning Features
- Course browsing
- Lesson tracking
- Progress certificates
- Streak system
- Achievement badges

### Social Features
- Real-time messaging
- Discussion forums
- User profiles
- Online status indicators

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall dependencies
cd server && npm install
cd ../client && npm install
```

### Socket Connection Failed
- Ensure backend server is running on port 5000
- Check browser console for connection errors
- Verify firewall settings

## 📝 Environment Variables

Create `.env` file in server directory:
```env
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### Backend
- Deploy to Heroku, Railway, or DigitalOcean
- Add MongoDB Atlas or PostgreSQL
- Configure environment variables
- Enable HTTPS

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or AWS S3
- Update API URL in production

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📧 Support

For issues and questions:
- GitHub Issues: https://github.com/Chanikyachowdarysamineni/Grow-UP/issues
- Email: support@growup.dev

## 🎯 Roadmap

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] JWT authentication
- [ ] File upload for avatars
- [ ] Video lessons
- [ ] Quiz system
- [ ] Payment integration
- [ ] Mobile app
- [ ] Email notifications
- [ ] Advanced analytics

---

Made with ❤️ by the Grow Up Team
