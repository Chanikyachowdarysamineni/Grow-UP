import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface BookmarkedCourse {
  id: string;
  title: string;
  instructor: string;
  category: string;
  progress: number;
  bookmarkedDate: string;
  thumbnail: string;
  duration: string;
  rating: number;
}

interface BookmarkedLesson {
  id: string;
  courseId: string;
  courseName: string;
  lessonTitle: string;
  lessonNumber: number;
  bookmarkedDate: string;
  notes?: string;
}

const Bookmarks: React.FC = () => {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<BookmarkedCourse[]>([]);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<BookmarkedLesson[]>([]);
  const [selectedView, setSelectedView] = useState<'courses' | 'lessons'>('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'progress' | 'rating' | 'title'>('date');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const storedCourses = localStorage.getItem('bookmarkedCourses');
    const storedLessons = localStorage.getItem('bookmarkedLessons');

    const defaultCourses: BookmarkedCourse[] = [
      {
        id: '1',
        title: 'Advanced React Patterns',
        instructor: 'Sarah Johnson',
        category: 'Web Development',
        progress: 35,
        bookmarkedDate: new Date().toISOString(),
        thumbnail: '⚛️',
        duration: '12 hours',
        rating: 4.8
      },
      {
        id: '2',
        title: 'Machine Learning Fundamentals',
        instructor: 'Dr. Michael Chen',
        category: 'Data Science',
        progress: 0,
        bookmarkedDate: new Date(Date.now() - 86400000).toISOString(),
        thumbnail: '🤖',
        duration: '20 hours',
        rating: 4.9
      },
      {
        id: '3',
        title: 'UI/UX Design Masterclass',
        instructor: 'Emma Williams',
        category: 'Design',
        progress: 60,
        bookmarkedDate: new Date(Date.now() - 172800000).toISOString(),
        thumbnail: '🎨',
        duration: '15 hours',
        rating: 4.7
      },
      {
        id: '4',
        title: 'Python for Data Analysis',
        instructor: 'James Rodriguez',
        category: 'Programming',
        progress: 20,
        bookmarkedDate: new Date(Date.now() - 259200000).toISOString(),
        thumbnail: '🐍',
        duration: '18 hours',
        rating: 4.6
      }
    ];

    const defaultLessons: BookmarkedLesson[] = [
      {
        id: '1',
        courseId: '1',
        courseName: 'Advanced React Patterns',
        lessonTitle: 'Custom Hooks Deep Dive',
        lessonNumber: 7,
        bookmarkedDate: new Date().toISOString(),
        notes: 'Important: Review useCallback optimization techniques'
      },
      {
        id: '2',
        courseId: '3',
        courseName: 'UI/UX Design Masterclass',
        lessonTitle: 'Color Theory and Psychology',
        lessonNumber: 12,
        bookmarkedDate: new Date(Date.now() - 86400000).toISOString(),
        notes: 'Great examples of complementary color schemes'
      },
      {
        id: '3',
        courseId: '2',
        courseName: 'Machine Learning Fundamentals',
        lessonTitle: 'Neural Networks Introduction',
        lessonNumber: 5,
        bookmarkedDate: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    setBookmarkedCourses(storedCourses ? JSON.parse(storedCourses) : defaultCourses);
    setBookmarkedLessons(storedLessons ? JSON.parse(storedLessons) : defaultLessons);
  };

  const removeBookmarkCourse = (courseId: string) => {
    const updated = bookmarkedCourses.filter(c => c.id !== courseId);
    setBookmarkedCourses(updated);
    localStorage.setItem('bookmarkedCourses', JSON.stringify(updated));
  };

  const removeBookmarkLesson = (lessonId: string) => {
    const updated = bookmarkedLessons.filter(l => l.id !== lessonId);
    setBookmarkedLessons(updated);
    localStorage.setItem('bookmarkedLessons', JSON.stringify(updated));
  };

  const updateLessonNote = (lessonId: string, note: string) => {
    const updated = bookmarkedLessons.map(l =>
      l.id === lessonId ? { ...l, notes: note } : l
    );
    setBookmarkedLessons(updated);
    localStorage.setItem('bookmarkedLessons', JSON.stringify(updated));
  };

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const selectAllCourses = () => {
    const filteredIds = bookmarkedCourses
      .filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .map(c => c.id);
    
    if (selectedCourses.length === filteredIds.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredIds);
    }
  };

  const bulkDeleteCourses = () => {
    if (!window.confirm(`Delete ${selectedCourses.length} selected course(s)?`)) return;
    
    const updatedCourses = bookmarkedCourses.filter(course => !selectedCourses.includes(course.id));
    setBookmarkedCourses(updatedCourses);
    localStorage.setItem('bookmarkedCourses', JSON.stringify(updatedCourses));
    setSelectedCourses([]);
  };

  // Filter and sort courses
  let filteredCourses = bookmarkedCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Apply sorting
  filteredCourses = filteredCourses.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.bookmarkedDate).getTime() - new Date(a.bookmarkedDate).getTime();
      case 'progress':
        return b.progress - a.progress;
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const categories = ['all', 'Web Development', 'Data Science', 'Design', 'Programming'];

  const filteredLessons = bookmarkedLessons.filter(lesson =>
    lesson.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2">My Bookmarks</h1>
          <p className="text-indigo-100">Saved courses and lessons for quick access</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Search and Sort Row */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              {/* Sort Dropdown (only for courses view) */}
              {selectedView === 'courses' && (
                <div className="md:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="progress">Sort by Progress</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="title">Sort by Title</option>
                  </select>
                </div>
              )}
            </div>

            {/* Category Filter (only for courses view) */}
            {selectedView === 'courses' && (
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* Bulk Actions */}
            {selectedView === 'courses' && selectedCourses.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-indigo-800">
                  {selectedCourses.length} course{selectedCourses.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCourses([])}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Deselect All
                  </button>
                  <button
                    onClick={bulkDeleteCourses}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSelectedView('courses')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              selectedView === 'courses'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📚 Courses ({bookmarkedCourses.length})
          </button>
          <button
            onClick={() => setSelectedView('lessons')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              selectedView === 'lessons'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📑 Lessons ({bookmarkedLessons.length})
          </button>
        </div>

        {/* Bookmarked Courses */}
        {selectedView === 'courses' && (
          <div>
            {filteredCourses.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                    onChange={selectAllCourses}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Select All</span>
                </label>
                <span className="text-sm text-gray-600">
                  Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden ${
                      selectedCourses.includes(course.id) ? 'ring-2 ring-indigo-600' : ''
                    }`}
                  >
                    <div className="flex">
                      {/* Selection Checkbox */}
                      <div className="flex items-center justify-center w-12 bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => toggleCourseSelection(course.id)}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>

                      {/* Thumbnail */}
                      <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-6xl flex-shrink-0">
                        {course.thumbnail}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.instructor}</p>
                          </div>
                          <button
                            onClick={() => removeBookmarkCourse(course.id)}
                            className="text-yellow-500 hover:text-gray-400 text-2xl transition-colors"
                            title="Remove bookmark"
                          >
                            🔖
                          </button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>⭐ {course.rating}</span>
                          <span>⏱️ {course.duration}</span>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                            {course.category}
                          </span>
                        </div>

                        {course.progress > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Saved {new Date(course.bookmarkedDate).toLocaleDateString()}
                          </span>
                          <Link
                            to="/courses"
                            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                          >
                            {course.progress > 0 ? 'Continue →' : 'Start Learning →'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-2 bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookmarked Courses</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterCategory !== 'all'
                    ? 'No courses match your search criteria'
                    : 'Start bookmarking courses to save them for later'}
                </p>
                <Link
                  to="/courses"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Bookmarked Lessons */}
        {selectedView === 'lessons' && (
          <div className="space-y-4">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          Lesson {lesson.lessonNumber}
                        </span>
                        <span className="text-sm text-gray-500">{lesson.courseName}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.lessonTitle}</h3>
                      <p className="text-sm text-gray-500">
                        Bookmarked {new Date(lesson.bookmarkedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeBookmarkLesson(lesson.id)}
                      className="text-yellow-500 hover:text-gray-400 text-2xl transition-colors"
                      title="Remove bookmark"
                    >
                      🔖
                    </button>
                  </div>

                  {/* Notes Section */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📝 Personal Notes
                    </label>
                    <textarea
                      value={lesson.notes || ''}
                      onChange={(e) => updateLessonNote(lesson.id, e.target.value)}
                      placeholder="Add notes about this lesson..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-end">
                    <Link
                      to="/courses"
                      className="text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Go to Lesson →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📑</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookmarked Lessons</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? 'No lessons match your search'
                    : 'Bookmark individual lessons to review specific topics later'}
                </p>
                <Link
                  to="/courses"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
