import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const stats = [
    { label: 'Total Courses', value: '24', icon: '📚', color: 'bg-blue-500' },
    { label: 'Completed', value: '12', icon: '✅', color: 'bg-green-500' },
    { label: 'Active Sessions', value: '5', icon: '⚡', color: 'bg-yellow-500' },
    { label: 'Progress', value: '68%', icon: '📊', color: 'bg-purple-500' }
  ];

  const recentActivities = [
    { title: 'Completed React Advanced Patterns', time: '2 hours ago', type: 'completed' },
    { title: 'Started Node.js Masterclass', time: '5 hours ago', type: 'started' },
    { title: 'Completed JavaScript Quiz', time: '1 day ago', type: 'completed' },
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-poppins">
                Welcome back, {user?.name || 'User'}! 👋
              </h2>
              <p className="text-gray-600 font-inter text-lg">
                Here's your learning progress today
              </p>
            </div>
            <Link 
              to="/courses"
              className="hidden md:flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <span>Browse Courses</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 mb-1 font-poppins">{stat.value}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold font-inter">{stat.label}</p>
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>+12% from last week</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity & Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900 font-poppins flex items-center">
                  <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Recent Activities
                </h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">View all</button>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100 hover:border-indigo-100 cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg group-hover:scale-110 transition-transform ${
                      activity.type === 'completed' ? 'bg-green-100 text-green-600' :
                      activity.type === 'started' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'saved' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'completed' ? '✓' :
                       activity.type === 'started' ? '▶' :
                       activity.type === 'saved' ? '💾' : '🏆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 font-inter group-hover:text-indigo-600 transition-colors">{activity.title}</p>
                      <p className="text-sm text-gray-500 font-inter mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Opened Courses */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900 font-poppins flex items-center">
                  <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Continue Learning
                </h3>
                <Link to="/courses" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">View all</Link>
              </div>
              <div className="space-y-4">
                {recentCourses.map((course, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-all duration-300 hover:shadow-md group cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {course.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 font-inter group-hover:text-indigo-600 transition-colors">{course.title}</h4>
                            <span className="text-xs text-gray-500 font-inter inline-block mt-1 px-2 py-1 bg-gray-100 rounded">{course.category}</span>
                          </div>
                          <span className="text-sm font-bold text-indigo-600 ml-2">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300 group-hover:bg-indigo-700"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                          <span>Continue Learning</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Saved Files & Notifications */}
          <div className="space-y-6">
            {/* Saved Notes */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 font-poppins flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Saved Notes
                </h3>
              </div>
              <div className="space-y-2">
                {savedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 cursor-pointer group border border-transparent hover:border-indigo-100"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                        📄
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 font-inter truncate group-hover:text-indigo-600 transition-colors">{file.name}</p>
                        <p className="text-xs text-gray-500 font-inter">{file.date} • {file.size}</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 font-poppins flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                </h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">3 new</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      ✨
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 font-inter">New course available!</p>
                      <p className="text-xs text-gray-600 mt-1 font-inter">Check out "Advanced TypeScript Patterns"</p>
                      <p className="text-xs text-gray-500 mt-2">5 min ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500 hover:bg-green-100 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 font-inter">Assignment graded</p>
                      <p className="text-xs text-gray-600 mt-1 font-inter">You scored 95% on React Quiz</p>
                      <p className="text-xs text-gray-500 mt-2">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500 hover:bg-purple-100 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      🎉
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 font-inter">Milestone achieved!</p>
                      <p className="text-xs text-gray-600 mt-1 font-inter">You've completed 50 hours of learning</p>
                      <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                    </div>
                  </div>
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