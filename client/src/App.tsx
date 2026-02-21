import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import UserProfile from './pages/UserProfile';
import Progress from './pages/Progress';
import Bookmarks from './pages/Bookmarks';
import Notes from './pages/Notes';
import Forums from './pages/Forums';
import Messages from './pages/Messages';
import VideoPlayer from './pages/VideoPlayer';
import QuizAssessment from './pages/QuizAssessment';
import CodePlayground from './pages/CodePlayground';
import ProjectSubmissions from './pages/ProjectSubmissions';
import LearningPaths from './pages/LearningPaths';
import Flashcards from './pages/Flashcards';
import AITutor from './pages/AITutor';
import { initializeSocket, disconnectSocket } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Check if user is logged in and initialize socket
  React.useEffect(() => {
    const initializeApp = async () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (userData) {
        setIsAuthenticated(true);
        const user = JSON.parse(userData);
        // Initialize real-time connection with token for authentication
        // This is async and won't block the app if server is not available
        try {
          await initializeSocket(user.id, token || undefined);
        } catch (error) {
          console.warn('⚠️ Real-time features unavailable. Make sure backend is running.');
          // App will still work, just without real-time features
        }
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forums"
            element={
              <ProtectedRoute>
                <Forums />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/:videoId"
            element={
              <ProtectedRoute>
                <VideoPlayer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <QuizAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playground"
            element={
              <ProtectedRoute>
                <CodePlayground />
              </ProtectedRoute>
            }
          />
          <Route
            path="/code-playground"
            element={
              <ProtectedRoute>
                <CodePlayground />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning-paths"
            element={
              <ProtectedRoute>
                <LearningPaths />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flashcards"
            element={
              <ProtectedRoute>
                <Flashcards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tutor"
            element={
              <ProtectedRoute>
                <AITutor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;