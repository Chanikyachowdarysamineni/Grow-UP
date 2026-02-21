import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: '📚',
      title: 'Interactive Courses',
      description: 'Access hundreds of high-quality courses designed to help you master new skills at your own pace.',
      color: 'bg-blue-50'
    },
    {
      icon: '�',
      title: 'Personal Dashboard',
      description: 'Track your progress, view analytics, and stay organized with a personalized learning dashboard.',
      color: 'bg-green-50'
    },
    {
      icon: '💻',
      title: 'Code Playground',
      description: 'Practice coding with an interactive playground supporting multiple programming languages.',
      color: 'bg-purple-50'
    },
    {
      icon: '🔍',
      title: 'Powerful Search',
      description: 'Find exactly what you need with our intelligent search engine across all courses and content.',
      color: 'bg-yellow-50'
    },
    {
      icon: '🎯',
      title: 'Skill Tracking',
      description: 'Monitor your skill development with detailed progress reports and achievement badges.',
      color: 'bg-pink-50'
    },
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Your data is protected with industry-standard security and encrypted authentication.',
      color: 'bg-indigo-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 font-poppins">Grow Up</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-6 py-2.5 text-gray-700 font-semibold hover:text-indigo-600 transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 sm:py-32 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-5xl mx-auto relative">
            {/* Floating Sticky Note - Left */}
            <div className="hidden lg:block absolute -left-40 top-0 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="bg-yellow-100 p-6 rounded-lg shadow-xl border-t-4 border-yellow-400 w-56">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-400 rounded-full shadow-md"></div>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-handwriting leading-relaxed">
                  Track your learning progress and complete courses with ease
                </p>
              </div>
            </div>

            {/* Floating Widget - Right */}
            <div className="hidden lg:block absolute -right-40 top-10 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 w-64">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">⏰</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Learning Stats</p>
                      <p className="text-sm font-bold text-gray-900">This Week</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Courses completed</span>
                    <span className="font-bold text-green-600">3</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-gray-600">Study time</span>
                    <span className="font-bold text-indigo-600">12hrs 30min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Hero Content */}
            <div className="relative z-10">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 font-poppins leading-tight">
                Think, plan, and track
                <br />
                <span className="text-gray-400">all in one place</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-inter leading-relaxed">
                Efficiently manage your learning and boost productivity
              </p>
              
              <div className="flex justify-center mb-16">
                <Link 
                  to="/register" 
                  className="group px-10 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 text-lg"
                >
                  <span>Get free demo</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* Bottom Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-20">
                {/* Today's Tasks Widget */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-left transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-sm font-semibold text-gray-500 mb-4">Today's tasks</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Complete React course</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-20 bg-gray-100 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">60%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Practice algorithms</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-20 bg-gray-100 rounded-full h-1.5">
                            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">75%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integrations Widget */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-left transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-sm font-semibold text-gray-500 mb-4">100+ Learning tools</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm transform hover:scale-110 transition-transform">
                      <span className="text-3xl">📚</span>
                    </div>
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm transform hover:scale-110 transition-transform">
                      <span className="text-3xl">💻</span>
                    </div>
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm transform hover:scale-110 transition-transform">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                      +97
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-3 font-poppins">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 font-inter max-w-2xl mx-auto">
              Powerful tools and features designed to accelerate your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`relative group p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all duration-300 cursor-pointer ${
                  hoveredFeature === index ? 'shadow-xl scale-105' : 'shadow-sm hover:shadow-lg'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`absolute inset-0 ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-inter">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm">Learn more</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-poppins">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 font-inter max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners worldwide who are already achieving their goals. Start your journey today—absolutely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="group px-10 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-2xl w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-xl w-full sm:w-auto text-center"
            >
              Sign In
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 font-poppins">10k+</div>
              <div className="text-indigo-200 text-sm font-inter">Active Learners</div>
            </div>
            <div className="text-center border-x border-indigo-400">
              <div className="text-4xl font-bold text-white mb-2 font-poppins">500+</div>
              <div className="text-indigo-200 text-sm font-inter">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 font-poppins">98%</div>
              <div className="text-indigo-200 text-sm font-inter">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <h3 className="text-2xl font-bold font-poppins">Grow Up</h3>
              </div>
              <p className="text-gray-400 mb-6 font-inter max-w-md">
                Empowering learners worldwide with quality education and cutting-edge tools to achieve their dreams.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </button>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 font-poppins">Quick Links</h4>
              <ul className="space-y-2 font-inter">
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><button type="button" className="text-gray-400 hover:text-white transition-colors">About Us</button></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-bold mb-4 font-poppins">Support</h4>
              <ul className="space-y-2 font-inter">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm font-inter">
              © 2026 Grow Up. All rights reserved. Built with ❤️ for learners worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;