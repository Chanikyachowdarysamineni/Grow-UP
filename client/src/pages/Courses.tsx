import React, { useState } from 'react';
import Navbar from '../components/Navbar';

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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-poppins">
                Explore Courses
              </h2>
              <p className="text-gray-600 font-inter text-lg">
                Discover and master new skills with expert-led courses
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for courses, topics, or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-inter text-lg bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 font-inter border-2 ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer"
            >
              {/* Course Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-7xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <span className="relative z-10 transform group-hover:scale-110 transition-transform">{course.thumbnail}</span>
              </div>

              {/* Course Content */}
              <div className="p-6">
                {/* Title and Level */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 font-poppins flex-1 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ml-2 flex-shrink-0 ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>

                {/* Category and Duration */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-3 py-1.5 rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs text-gray-500 font-inter flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-inter leading-relaxed">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center mb-4 text-sm text-gray-600 pb-4 border-b border-gray-100">
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-inter font-medium">{course.instructor}</span>
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-inter font-medium">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className="font-bold text-indigo-600">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 group-hover:bg-indigo-700"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Continue Button */}
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                  <span>{course.progress === 0 ? 'Start Course' : 'Continue Learning'}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-poppins">No courses found</h3>
            <p className="text-gray-600 font-inter mb-6">Try adjusting your search or filters</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Stats Summary */}
        {filteredCourses.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-10 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 text-center font-poppins">Your Learning Journey</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-5xl font-bold mb-2 font-poppins">{courses.length}</div>
                <div className="text-indigo-100 font-inter">Total Courses</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-5xl font-bold mb-2 font-poppins">
                  {courses.filter(c => c.progress === 100).length}
                </div>
                <div className="text-indigo-100 font-inter">Completed</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-5xl font-bold mb-2 font-poppins">
                  {courses.filter(c => c.progress > 0 && c.progress < 100).length}
                </div>
                <div className="text-indigo-100 font-inter">In Progress</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-5xl font-bold mb-2 font-poppins">
                  {Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%
                </div>
                <div className="text-indigo-100 font-inter">Overall Progress</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;