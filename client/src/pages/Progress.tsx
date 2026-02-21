import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface CourseProgress {
  id: string;
  title: string;
  completion: number;
  lastAccessed: string;
  timeSpent: number;
  certificateEarned: boolean;
}

interface Certificate {
  id: string;
  courseName: string;
  completionDate: string;
  instructor: string;
  certificateNumber: string;
}

interface Streak {
  current: number;
  longest: number;
  lastActiveDate: string;
  totalDays: number;
}

const Progress: React.FC = () => {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [streak, setStreak] = useState<Streak>({ current: 0, longest: 0, lastActiveDate: '', totalDays: 0 });
  const [selectedView, setSelectedView] = useState<'courses' | 'certificates' | 'stats'>('courses');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    loadProgressData();
    updateStreak();
  }, []);

  const loadProgressData = () => {
    const storedProgress = localStorage.getItem('courseProgress');
    const storedCertificates = localStorage.getItem('certificates');

    const defaultCourses: CourseProgress[] = [
      {
        id: '1',
        title: 'React Fundamentals',
        completion: 100,
        lastAccessed: new Date(Date.now() - 86400000).toISOString(),
        timeSpent: 1200,
        certificateEarned: true
      },
      {
        id: '2',
        title: 'Advanced JavaScript',
        completion: 75,
        lastAccessed: new Date().toISOString(),
        timeSpent: 900,
        certificateEarned: false
      },
      {
        id: '3',
        title: 'Python for Beginners',
        completion: 60,
        lastAccessed: new Date(Date.now() - 172800000).toISOString(),
        timeSpent: 720,
        certificateEarned: false
      },
      {
        id: '4',
        title: 'Node.js Backend Development',
        completion: 45,
        lastAccessed: new Date(Date.now() - 259200000).toISOString(),
        timeSpent: 540,
        certificateEarned: false
      },
      {
        id: '5',
        title: 'CSS Mastery',
        completion: 100,
        lastAccessed: new Date(Date.now() - 604800000).toISOString(),
        timeSpent: 600,
        certificateEarned: true
      }
    ];

    const defaultCertificates: Certificate[] = [
      {
        id: '1',
        courseName: 'React Fundamentals',
        completionDate: new Date(Date.now() - 86400000).toISOString(),
        instructor: 'Dr. Sarah Johnson',
        certificateNumber: 'GU-2026-RF-00127'
      },
      {
        id: '2',
        courseName: 'CSS Mastery',
        completionDate: new Date(Date.now() - 604800000).toISOString(),
        instructor: 'Prof. Michael Chen',
        certificateNumber: 'GU-2026-CM-00089'
      }
    ];

    setCourses(storedProgress ? JSON.parse(storedProgress) : defaultCourses);
    setCertificates(storedCertificates ? JSON.parse(storedCertificates) : defaultCertificates);
  };

  const updateStreak = () => {
    const storedStreak = localStorage.getItem('learningStreak');
    
    if (storedStreak) {
      const streakData = JSON.parse(storedStreak);
      const lastDate = new Date(streakData.lastActiveDate);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 0) {
        setStreak(streakData);
      } else if (diffDays === 1) {
        const updatedStreak = {
          ...streakData,
          current: streakData.current + 1,
          longest: Math.max(streakData.longest, streakData.current + 1),
          lastActiveDate: today.toISOString(),
          totalDays: streakData.totalDays + 1
        };
        setStreak(updatedStreak);
        localStorage.setItem('learningStreak', JSON.stringify(updatedStreak));
      } else {
        const resetStreak = {
          ...streakData,
          current: 1,
          lastActiveDate: today.toISOString(),
          totalDays: streakData.totalDays + 1
        };
        setStreak(resetStreak);
        localStorage.setItem('learningStreak', JSON.stringify(resetStreak));
      }
    } else {
      const newStreak = {
        current: 7,
        longest: 14,
        lastActiveDate: new Date().toISOString(),
        totalDays: 45
      };
      setStreak(newStreak);
      localStorage.setItem('learningStreak', JSON.stringify(newStreak));
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalCompletion = courses.reduce((acc, course) => acc + course.completion, 0) / courses.length;
  const totalTimeSpent = courses.reduce((acc, course) => acc + course.timeSpent, 0);
  const completedCourses = courses.filter(c => c.completion === 100).length;

  const downloadCertificate = (certificate: Certificate) => {
    // In a real app, this would generate and download a PDF
    alert(`Certificate ${certificate.certificateNumber} for "${certificate.courseName}" would be downloaded as PDF.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Your Progress</h1>
          <p className="text-indigo-100">Track your learning journey and achievements</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Current Streak</span>
              <span className="text-3xl">🔥</span>
            </div>
            <div className="text-4xl font-bold text-indigo-600 mb-1">{streak.current}</div>
            <div className="text-sm text-gray-500">days in a row</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Longest Streak</span>
              <span className="text-3xl">⭐</span>
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-1">{streak.longest}</div>
            <div className="text-sm text-gray-500">days total</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Completed</span>
              <span className="text-3xl">✅</span>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-1">{completedCourses}</div>
            <div className="text-sm text-gray-500">of {courses.length} courses</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Time Spent</span>
              <span className="text-3xl">⏱️</span>
            </div>
            <div className="text-4xl font-bold text-yellow-600 mb-1">{Math.floor(totalTimeSpent / 60)}h</div>
            <div className="text-sm text-gray-500">learning time</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setSelectedView('courses')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              selectedView === 'courses'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Course Progress
          </button>
          <button
            onClick={() => setSelectedView('certificates')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              selectedView === 'certificates'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Certificates
          </button>
          <button
            onClick={() => setSelectedView('stats')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              selectedView === 'stats'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Course Progress View */}
        {selectedView === 'courses' && (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500">
                      Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">{course.completion}%</div>
                    {course.certificateEarned && (
                      <span className="text-sm text-green-600 font-medium">✓ Certified</span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${course.completion}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>⏱️ {formatTime(course.timeSpent)} spent</span>
                  {course.completion === 100 ? (
                    <Link
                      to="/courses"
                      className="text-green-600 font-semibold hover:text-green-700"
                    >
                      View Certificate →
                    </Link>
                  ) : (
                    <Link
                      to="/courses"
                      className="text-indigo-600 font-semibold hover:text-indigo-700"
                    >
                      Continue Learning →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificates View */}
        {selectedView === 'certificates' && (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.length > 0 ? (
              certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-xl shadow-sm p-8 border-2 border-yellow-400 relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCertificate(cert)}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -mr-16 -mt-16 opacity-50" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full -ml-12 -mb-12 opacity-50" />
                  
                  <div className="relative">
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-4">🏆</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Certificate of Completion</h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-4" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Course Name</div>
                        <div className="font-semibold text-gray-800">{cert.courseName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Instructor</div>
                        <div className="font-semibold text-gray-800">{cert.instructor}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Completion Date</div>
                        <div className="font-semibold text-gray-800">
                          {new Date(cert.completionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Certificate Number</div>
                        <div className="font-mono text-sm text-indigo-600">{cert.certificateNumber}</div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadCertificate(cert);
                      }}
                      className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      📥 Download PDF
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Certificates Yet</h3>
                <p className="text-gray-600 mb-6">Complete courses to earn certificates</p>
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

        {/* Statistics View */}
        {selectedView === 'stats' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Completion Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold mb-6">Overall Progress</h3>
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Average Completion</span>
                  <span className="text-sm font-semibold text-indigo-600">{Math.round(totalCompletion)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${totalCompletion}%` }}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-700">Completed Courses</span>
                  <span className="text-2xl font-bold text-green-600">{completedCourses}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <span className="font-medium text-gray-700">In Progress</span>
                  <span className="text-2xl font-bold text-yellow-600">{courses.length - completedCourses}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                  <span className="font-medium text-gray-700">Total Enrolled</span>
                  <span className="text-2xl font-bold text-indigo-600">{courses.length}</span>
                </div>
              </div>
            </div>

            {/* Streak Calendar */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold mb-6">Learning Streak</h3>
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">🔥</div>
                <div className="text-5xl font-bold text-indigo-600 mb-2">{streak.current}</div>
                <div className="text-gray-600">Day Streak</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Current Streak</span>
                  <span className="text-xl font-bold text-indigo-600">{streak.current} days</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Longest Streak</span>
                  <span className="text-xl font-bold text-purple-600">{streak.longest} days</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Total Active Days</span>
                  <span className="text-xl font-bold text-green-600">{streak.totalDays} days</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-800 text-center">
                  🎯 Keep it up! Come back tomorrow to maintain your streak
                </p>
              </div>
            </div>

            {/* Time Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
              <h3 className="text-xl font-bold mb-6">Time Spent by Course</h3>
              <div className="space-y-4">
                {courses
                  .sort((a, b) => b.timeSpent - a.timeSpent)
                  .map((course) => (
                    <div key={course.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{course.title}</span>
                        <span className="text-sm font-semibold text-indigo-600">{formatTime(course.timeSpent)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${(course.timeSpent / totalTimeSpent) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">Total Time Spent</span>
                  <span className="text-2xl font-bold text-indigo-600">{formatTime(totalTimeSpent)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            className="bg-white rounded-xl p-12 max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
            >
              ×
            </button>

            <div className="text-center">
              <div className="text-8xl mb-6">🏆</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Certificate of Completion</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-8" />

              <p className="text-xl text-gray-600 mb-6">This certifies that</p>
              <p className="text-3xl font-bold text-indigo-600 mb-6">
                {JSON.parse(localStorage.getItem('user') || '{}').name || 'Student'}
              </p>
              <p className="text-xl text-gray-600 mb-6">has successfully completed</p>
              <p className="text-2xl font-bold text-gray-800 mb-8">{selectedCertificate.courseName}</p>

              <div className="grid grid-cols-2 gap-8 mb-8 text-left max-w-md mx-auto">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Instructor</div>
                  <div className="font-semibold">{selectedCertificate.instructor}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Date</div>
                  <div className="font-semibold">
                    {new Date(selectedCertificate.completionDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-8">
                Certificate ID: {selectedCertificate.certificateNumber}
              </div>

              <button
                onClick={() => downloadCertificate(selectedCertificate)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-lg"
              >
                📥 Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
