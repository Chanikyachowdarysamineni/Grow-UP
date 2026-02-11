import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: '📚',
      title: 'Interactive Courses',
      description: 'Access hundreds of high-quality courses designed to help you master new skills at your own pace.'
    },
    {
      icon: '📝',
      title: 'Smart Editor',
      description: 'Write, code, and create with our powerful editor featuring syntax highlighting and auto-save.'
    },
    {
      icon: '📊',
      title: 'Personal Dashboard',
      description: 'Track your progress, view analytics, and stay organized with a personalized learning dashboard.'
    },
    {
      icon: '🔍',
      title: 'Powerful Search',
      description: 'Find exactly what you need with our intelligent search engine across all courses and content.'
    },
    {
      icon: '🎯',
      title: 'Skill Tracking',
      description: 'Monitor your skill development with detailed progress reports and achievement badges.'
    },
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Your data is protected with industry-standard security and encrypted authentication.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 animate-fade-in font-poppins">
            Grow Up
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-700 mb-4 animate-slide-up font-inter">
            Learn. Build. Grow.
          </p>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto animate-fade-in font-inter">
            Unlock your potential with our comprehensive online learning platform. 
            Master new skills, build amazing projects, and grow your career with expert-led courses 
            and cutting-edge tools designed for learners of all levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link 
              to="/login" 
              className="btn-primary w-full sm:w-auto text-center"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="btn-secondary w-full sm:w-auto text-center"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-poppins">
              Why Choose <span className="text-gradient">Grow Up</span>?
            </h2>
            <p className="text-xl text-gray-600 font-inter">
              Everything you need to accelerate your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3 font-poppins">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-inter">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-poppins">
            Start Your Growth Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-8 font-inter">
            Join thousands of learners who are already transforming their careers and achieving their goals.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-purple-600 font-semibold py-4 px-10 rounded-lg text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4 font-poppins">Grow Up</h3>
          <p className="text-gray-400 mb-6 font-inter">
            Learn. Build. Grow.
          </p>
          <p className="text-gray-500 text-sm font-inter">
            © 2026 Grow Up. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;