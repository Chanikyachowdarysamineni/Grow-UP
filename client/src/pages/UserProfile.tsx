import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface User {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  skills: string[];
  learningGoals: string[];
  badges: Badge[];
  joinDate: string;
  totalCourses: number;
  completedCourses: number;
  currentStreak: number;
  longestStreak: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    skills: '',
    learningGoals: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'badges' | 'activity'>('overview');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('userProfile');
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const profileData = storedProfile ? JSON.parse(storedProfile) : {};
      
      const defaultBadges: Badge[] = [
        {
          id: '1',
          name: 'First Login',
          icon: '🎉',
          description: 'Logged in for the first time',
          earnedDate: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Quick Learner',
          icon: '⚡',
          description: 'Completed first course in record time',
          earnedDate: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Dedicated Student',
          icon: '📚',
          description: 'Maintained a 7-day learning streak',
          earnedDate: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Code Master',
          icon: '💻',
          description: 'Completed 10 coding challenges',
          earnedDate: new Date().toISOString()
        }
      ];

      const profile: User = {
        name: userData.name || 'User',
        email: userData.email || '',
        avatar: profileData.avatar || '👤',
        bio: profileData.bio || 'Learning enthusiast passionate about growth and development.',
        skills: profileData.skills || ['JavaScript', 'React', 'Python', 'Node.js'],
        learningGoals: profileData.learningGoals || ['Master React', 'Learn TypeScript', 'Build 5 projects'],
        badges: profileData.badges || defaultBadges,
        joinDate: profileData.joinDate || new Date().toISOString(),
        totalCourses: profileData.totalCourses || 12,
        completedCourses: profileData.completedCourses || 5,
        currentStreak: profileData.currentStreak || 7,
        longestStreak: profileData.longestStreak || 14
      };

      setUser(profile);
      setEditForm({
        name: profile.name,
        bio: profile.bio,
        skills: profile.skills.join(', '),
        learningGoals: profile.learningGoals.join(', ')
      });
    }
  };

  const saveProfile = () => {
    if (!user) return;

    const updatedProfile = {
      ...user,
      name: editForm.name,
      bio: editForm.bio,
      skills: editForm.skills.split(',').map(s => s.trim()).filter(s => s),
      learningGoals: editForm.learningGoals.split(',').map(g => g.trim()).filter(g => g)
    };

    setUser(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Update user name in main user object
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userData.name = editForm.name;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    setIsEditing(false);
  };

  const handleAvatarChange = (emoji: string) => {
    if (!user) return;
    const updatedProfile = { ...user, avatar: emoji };
    setUser(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const addSkill = () => {
    if (!user || !newSkill.trim()) return;
    const updatedProfile = { ...user, skills: [...user.skills, newSkill.trim()] };
    setUser(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    if (!user) return;
    const updatedProfile = { ...user, skills: user.skills.filter(s => s !== skill) };
    setUser(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const addGoal = () => {
    if (!user || !newGoal.trim()) return;
    const updatedProfile = { ...user, learningGoals: [...user.learningGoals, newGoal.trim()] };
    setUser(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setNewGoal('');
  };

  const removeGoal = (goal: string) => {
    if (!user) return;
    const updatedProfile = { ...user, learningGoals: user.learningGoals.filter(g => g !== goal) };
    setUser(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const avatarEmojis = ['👤', '👨‍💻', '👩‍💻', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🦸', '🎯', '🚀', '⭐'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-7xl shadow-xl">
                {user.avatar}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-white text-sm font-medium px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Change
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
              <p className="text-indigo-100 mb-4">{user.email}</p>
              <p className="text-white/90 max-w-2xl">{user.bio}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{user.completedCourses}</div>
                  <div className="text-sm text-indigo-100">Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{user.totalCourses}</div>
                  <div className="text-sm text-indigo-100">Total Courses</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{user.currentStreak} 🔥</div>
                  <div className="text-sm text-indigo-100">Day Streak</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{user.badges.length}</div>
                  <div className="text-sm text-indigo-100">Badges Earned</div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      {isEditing && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
          <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Choose Avatar</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
              {avatarEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleAvatarChange(emoji)}
                  className={`text-4xl p-4 rounded-lg hover:bg-indigo-50 transition-colors ${
                    user.avatar === emoji ? 'bg-indigo-100 ring-2 ring-indigo-600' : 'bg-gray-50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              selectedTab === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('badges')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              selectedTab === 'badges'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Badges
          </button>
          <button
            onClick={() => setSelectedTab('activity')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              selectedTab === 'activity'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Activity
          </button>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Edit Form or Info Display */}
            {isEditing ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editForm.skills}
                      onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Learning Goals (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editForm.learningGoals}
                      onChange={(e) => setEditForm({ ...editForm, learningGoals: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={saveProfile}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">About</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Bio</h3>
                    <p className="text-gray-600">{user.bio}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Joined</h3>
                    <p className="text-gray-600">
                      {new Date(user.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium flex items-center gap-2 group"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="opacity-0 group-hover:opacity-100 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Add new skill..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                <button
                  onClick={addSkill}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Learning Goals</h2>
              <div className="space-y-3 mb-4">
                {user.learningGoals.map((goal, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl">🎯</span>
                    <span className="flex-1 text-gray-700">{goal}</span>
                    <button
                      onClick={() => removeGoal(goal)}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  placeholder="Add new learning goal..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                <button
                  onClick={addGoal}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {selectedTab === 'badges' && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-6xl mb-4">{badge.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{badge.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                <p className="text-xs text-gray-500">
                  Earned {new Date(badge.earnedDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Activity Tab */}
        {selectedTab === 'activity' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">📚</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Completed React Advanced Course</h3>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">🎯</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Achieved 7-day learning streak</h3>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">⭐</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Earned "Code Master" badge</h3>
                  <p className="text-sm text-gray-600">3 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">💻</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Started Python for Data Science</h3>
                  <p className="text-sm text-gray-600">5 days ago</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
