import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const stats = [
    { label: 'Total Courses', value: '24', icon: '📚', color: 'from-blue-500 to-blue-600' },
    { label: 'Completed', value: '12', icon: '✅', color: 'from-green-500 to-green-600' },
    { label: 'Active Sessions', value: '5', icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
    { label: 'Progress', value: '68%', icon: '📊', color: 'from-purple-500 to-purple-600' }
  ];

  const recentActivities = [
    { title: 'Completed React Advanced Patterns', time: '2 hours ago', type: 'completed' },
    { title: 'Started Node.js Masterclass', time: '5 hours ago', type: 'started' },
    { title: 'Saved code snippet in Editor', time: '1 day ago', type: 'saved' },
    { title: 'Earned "Fast Learner" Badge', time: '2 days ago', type: 'achievement' }
  ];

  const recentCourses = [
    { 
      title: 'React Advanced Patterns', 
      progress: 85, 
      thumbnail: '⚛️',
      category: 'Frontend'
    },
    { 
      title: 'Node.js Backend Development', 
      progress: 45, 
      thumbnail: '🟢',
      category: 'Backend'
    },
    { 
      title: 'TypeScript Deep Dive', 
      progress: 60, 
      thumbnail: '📘',
      category: 'Programming'
    }
  ];

  const savedFiles = [
    { name: 'authentication.js', date: 'Today', size: '2.4 KB' },
    { name: 'dashboard-component.tsx', date: 'Yesterday', size: '5.1 KB' },
    { name: 'api-routes.ts', date: '2 days ago', size: '3.8 KB' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-poppins">
                Grow Up
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="nav-link active">
                Dashboard
              </Link>
              <Link to="/editor" className="nav-link">
                Editor
              </Link>
              <Link to="/courses" className="nav-link">
                Courses
              </Link>
            </div>

            {/* Search and Profile */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden lg:block relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <svg
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Profile Icon */}
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Preferences
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-poppins">
            Welcome back, {user?.name || 'User'}! 👋
          </h2>
          <p className="text-gray-600 font-inter">
            Here's what's happening with your learning journey today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg text-2xl mb-4`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1 font-poppins">{stat.value}</p>
              <p className="text-gray-600 text-sm font-inter">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity & Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">
                Recent Activities
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'completed' ? 'bg-green-100 text-green-600' :
                      activity.type === 'started' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'saved' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'completed' ? '✓' :
                       activity.type === 'started' ? '▶' :
                       activity.type === 'saved' ? '💾' : '🏆'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 font-inter">{activity.title}</p>
                      <p className="text-sm text-gray-600 font-inter">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Opened Courses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">
                Recently Opened Courses
              </h3>
              <div className="space-y-4">
                {recentCourses.map((course, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl">
                        {course.thumbnail}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800 font-inter">{course.title}</h4>
                            <span className="text-xs text-gray-500 font-inter">{course.category}</span>
                          </div>
                          <span className="text-sm font-semibold text-purple-600">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <button className="mt-3 text-sm text-purple-600 font-semibold hover:text-purple-700">
                          Continue Learning →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Saved Files & Notifications */}
          <div className="space-y-8">
            {/* Saved Editor Files */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">
                Saved Editor Files
              </h3>
              <div className="space-y-3">
                {savedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                        📄
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 font-inter">{file.name}</p>
                        <p className="text-xs text-gray-500 font-inter">{file.date} • {file.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/editor"
                className="mt-4 block text-center text-sm text-purple-600 font-semibold hover:text-purple-700"
              >
                View All Files →
              </Link>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">
                Notifications
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-gray-800 font-inter">New course available!</p>
                  <p className="text-xs text-gray-600 mt-1 font-inter">Check out "Advanced TypeScript Patterns"</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm font-semibold text-gray-800 font-inter">Assignment graded</p>
                  <p className="text-xs text-gray-600 mt-1 font-inter">You scored 95% on React Quiz</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <p className="text-sm font-semibold text-gray-800 font-inter">Milestone achieved! 🎉</p>
                  <p className="text-xs text-gray-600 mt-1 font-inter">You've completed 50 hours of learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;