import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Course {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  current: boolean;
}

interface Path {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  duration: string;
  courses: Course[];
  enrolled: boolean;
  progress: number;
}

const LearningPaths: React.FC = () => {
  const [paths, setPaths] = useState<Path[]>([
    {
      id: '1',
      title: 'Frontend Web Development',
      level: 'Beginner',
      description: 'Master frontend development from HTML/CSS to React and beyond',
      duration: '6 months',
      enrolled: true,
      progress: 45,
      courses: [
        { id: 'c1', title: 'HTML & CSS Fundamentals', duration: '2 weeks', completed: true, current: false },
        { id: 'c2', title: 'JavaScript Basics', duration: '3 weeks', completed: true, current: false },
        { id: 'c3', title: 'React Fundamentals', duration: '4 weeks', completed: false, current: true },
        { id: 'c4', title: 'Advanced React Patterns', duration: '3 weeks', completed: false, current: false },
        { id: 'c5', title: 'State Management (Redux)', duration: '2 weeks', completed: false, current: false },
        { id: 'c6', title: 'Testing with Jest & RTL', duration: '2 weeks', completed: false, current: false },
      ]
    },
    {
      id: '2',
      title: 'Full Stack JavaScript',
      level: 'Intermediate',
      description: 'Build complete web applications with frontend and backend',
      duration: '8 months',
      enrolled: false,
      progress: 0,
      courses: [
        { id: 'c7', title: 'Node.js & Express', duration: '4 weeks', completed: false, current: false },
        { id: 'c8', title: 'MongoDB & Mongoose', duration: '3 weeks', completed: false, current: false },
        { id: 'c9', title: 'REST API Design', duration: '2 weeks', completed: false, current: false },
        { id: 'c10', title: 'Authentication & Security', duration: '3 weeks', completed: false, current: false },
        { id: 'c11', title: 'GraphQL', duration: '2 weeks', completed: false, current: false },
        { id: 'c12', title: 'Deployment & DevOps', duration: '2 weeks', completed: false, current: false },
      ]
    },
    {
      id: '3',
      title: 'Data Science with Python',
      level: 'Beginner',
      description: 'Learn data analysis, visualization, and machine learning',
      duration: '10 months',
      enrolled: false,
      progress: 0,
      courses: [
        { id: 'c13', title: 'Python Programming', duration: '4 weeks', completed: false, current: false },
        { id: 'c14', title: 'NumPy & Pandas', duration: '3 weeks', completed: false, current: false },
        { id: 'c15', title: 'Data Visualization', duration: '2 weeks', completed: false, current: false },
        { id: 'c16', title: 'Statistics & Probability', duration: '4 weeks', completed: false, current: false },
        { id: 'c17', title: 'Machine Learning Basics', duration: '5 weeks', completed: false, current: false },
        { id: 'c18', title: 'Deep Learning', duration: '6 weeks', completed: false, current: false },
      ]
    }
  ]);

  const enrollInPath = (pathId: string) => {
    setPaths(paths.map(p => 
      p.id === pathId ? { ...p, enrolled: true } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Learning Journey</h2>
          <p className="text-gray-600">Structured paths to take you from beginner to expert</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {paths.map(path => (
            <div key={path.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header */}
              <div className={`p-6 ${
                path.level === 'Beginner' ? 'bg-green-50' :
                path.level === 'Intermediate' ? 'bg-blue-50' :
                'bg-purple-50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                      path.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      path.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {path.level}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{path.title}</h3>
                    <p className="text-gray-700 mb-4">{path.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>⏱️ {path.duration}</span>
                      <span>📚 {path.courses.length} courses</span>
                    </div>
                  </div>
                </div>

                {path.enrolled && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-indigo-600">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Courses */}
              <div className="p-6">
                <h4 className="font-bold text-gray-900 mb-4">Course Curriculum</h4>
                <div className="space-y-3">
                  {path.courses.map((course, index) => (
                    <div
                      key={course.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        course.completed ? 'bg-green-50' :
                        course.current ? 'bg-indigo-50 ring-2 ring-indigo-500' :
                        'bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        course.completed ? 'bg-green-500 text-white' :
                        course.current ? 'bg-indigo-500 text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {course.completed ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          course.current ? 'text-indigo-900' : 'text-gray-900'
                        }`}>
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500">{course.duration}</p>
                      </div>
                      {course.current && (
                        <span className="text-xs font-semibold text-indigo-600">In Progress</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="px-6 pb-6">
                {path.enrolled ? (
                  <Link
                    to="/courses"
                    className="block w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-center hover:bg-indigo-700"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  <button
                    onClick={() => enrollInPath(path.id)}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                  >
                    Enroll in Path
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPaths;