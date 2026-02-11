import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  level: string;
  instructor: string;
}

const Courses: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'Mobile', 'Data Science', 'DevOps'];

  const courses: Course[] = [
    {
      id: 1,
      title: 'React Advanced Patterns',
      description: 'Master advanced React patterns including hooks, context, and performance optimization',
      thumbnail: '⚛️',
      category: 'Frontend',
      progress: 85,
      totalLessons: 42,
      completedLessons: 36,
      duration: '12 hours',
      level: 'Advanced',
      instructor: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js, Express, and MongoDB',
      thumbnail: '🟢',
      category: 'Backend',
      progress: 45,
      totalLessons: 38,
      completedLessons: 17,
      duration: '15 hours',
      level: 'Intermediate',
      instructor: 'Michael Chen'
    },
    {
      id: 3,
      title: 'TypeScript Deep Dive',
      description: 'Complete guide to TypeScript from basics to advanced type system',
      thumbnail: '📘',
      category: 'Frontend',
      progress: 60,
      totalLessons: 30,
      completedLessons: 18,
      duration: '10 hours',
      level: 'Intermediate',
      instructor: 'Emily Davis'
    },
    {
      id: 4,
      title: 'Full Stack Web Development',
      description: 'Learn to build complete web applications from frontend to backend',
      thumbnail: '🚀',
      category: 'Full Stack',
      progress: 30,
      totalLessons: 50,
      completedLessons: 15,
      duration: '25 hours',
      level: 'Beginner',
      instructor: 'David Wilson'
    },
    {
      id: 5,
      title: 'React Native Mobile Apps',
      description: 'Create cross-platform mobile applications using React Native',
      thumbnail: '📱',
      category: 'Mobile',
      progress: 20,
      totalLessons: 35,
      completedLessons: 7,
      duration: '18 hours',
      level: 'Intermediate',
      instructor: 'Lisa Anderson'
    },
    {
      id: 6,
      title: 'Python Data Science',
      description: 'Data analysis and machine learning with Python, Pandas, and Scikit-learn',
      thumbnail: '🐍',
      category: 'Data Science',
      progress: 10,
      totalLessons: 45,
      completedLessons: 4,
      duration: '20 hours',
      level: 'Beginner',
      instructor: 'Robert Martinez'
    },
    {
      id: 7,
      title: 'Docker & Kubernetes',
      description: 'Containerization and orchestration for modern applications',
      thumbnail: '🐳',
      category: 'DevOps',
      progress: 0,
      totalLessons: 28,
      completedLessons: 0,
      duration: '14 hours',
      level: 'Advanced',
      instructor: 'Jennifer Lee'
    },
    {
      id: 8,
      title: 'GraphQL API Design',
      description: 'Build efficient APIs with GraphQL and Apollo Server',
      thumbnail: '🔷',
      category: 'Backend',
      progress: 0,
      totalLessons: 25,
      completedLessons: 0,
      duration: '11 hours',
      level: 'Intermediate',
      instructor: 'Kevin Brown'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-poppins">
                Grow Up
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/editor" className="nav-link">
                Editor
              </Link>
              <Link to="/courses" className="nav-link active">
                Courses
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile Settings
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
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-poppins">
            My Courses
          </h2>
          <p className="text-gray-600 font-inter">
            Continue your learning journey with our expert-led courses
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-inter"
            />
            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
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
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 font-inter ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Course Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-6xl">
                {course.thumbnail}
              </div>

              {/* Course Content */}
              <div className="p-6">
                {/* Title and Level */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800 font-poppins flex-1">
                    {course.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>

                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs text-gray-500 font-inter">
                    {course.duration}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-inter">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center mb-4 text-sm text-gray-600">
                  <span className="mr-2">👨‍🏫</span>
                  <span className="font-inter">{course.instructor}</span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-inter">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className="font-semibold text-purple-600">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Continue Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                  {course.progress === 0 ? 'Start Course' : 'Continue Learning'} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">No courses found</h3>
            <p className="text-gray-600 font-inter">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-2 font-poppins">{courses.length}</div>
              <div className="text-white/80 font-inter">Total Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 font-poppins">
                {courses.filter(c => c.progress === 100).length}
              </div>
              <div className="text-white/80 font-inter">Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 font-poppins">
                {courses.filter(c => c.progress > 0 && c.progress < 100).length}
              </div>
              <div className="text-white/80 font-inter">In Progress</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 font-poppins">
                {Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%
              </div>
              <div className="text-white/80 font-inter">Overall Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;