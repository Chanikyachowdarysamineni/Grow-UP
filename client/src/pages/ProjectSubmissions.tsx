import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Project {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  maxScore: number;
  requirements: string[];
  submissionTypes: ('code' | 'file' | 'url')[];
}

interface Submission {
  id: string;
  projectId: string;
  studentId: string;
  submittedAt: string;
  files: { name: string; size: number; type: string }[];
  codeUrl?: string;
  liveUrl?: string;
  notes: string;
  status: 'pending' | 'reviewed' | 'approved' | 'needsRevision';
  score?: number;
  feedback?: string;
  feedbackDate?: string;
}

const ProjectSubmissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'submitted'>('available');
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Submission form state
  const [files, setFiles] = useState<File[]>([]);
  const [codeUrl, setCodeUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Sample projects
  const sampleProjects: Project[] = [
    {
      id: 'proj-1',
      title: 'Build a Todo App with React',
      description: 'Create a fully functional todo application using React hooks and local storage',
      courseId: 'react-101',
      courseName: 'React Fundamentals',
      dueDate: '2026-03-15',
      maxScore: 100,
      requirements: [
        'Use React functional components',
        'Implement useState and useEffect hooks',
        'Add/Edit/Delete functionality',
        'Persist data in localStorage',
        'Responsive design',
        'Clean, readable code'
      ],
      submissionTypes: ['code', 'url', 'file']
    },
    {
      id: 'proj-2',
      title: 'REST API with Node.js',
      description: 'Build a RESTful API for a blog system with authentication',
      courseId: 'node-101',
      courseName: 'Node.js Backend',
      dueDate: '2026-03-20',
      maxScore: 100,
      requirements: [
        'Express.js server',
        'CRUD operations for blog posts',
        'User authentication (JWT)',
        'MongoDB database',
        'Error handling',
        'API documentation'
      ],
      submissionTypes: ['code','file']
    },
    {
      id: 'proj-3',
      title: 'Personal Portfolio Website',
      description: 'Design and build a personal portfolio showcasing your projects',
      courseId: 'webdev-101',
      courseName: 'Web Development',
      dueDate: '2026-03-25',
      maxScore: 100,
      requirements: [
        'Responsive design',
        'About section',
        'Projects showcase',
        'Contact form',
        'Modern UI/UX',
        'Deployed online'
      ],
      submissionTypes: ['url', 'file']
    }
  ];

  useEffect(() => {
    setProjects(sampleProjects);
    
    // Load submissions from localStorage
    const savedSubmissions = localStorage.getItem('project-submissions');
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const submitProject = () => {
    if (!selectedProject) return;

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { id: 'user-1' };

    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      projectId: selectedProject.id,
      studentId: user.id,
      submittedAt: new Date().toISOString(),
      files: files.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
      })),
      codeUrl: codeUrl || undefined,
      liveUrl: liveUrl || undefined,
      notes,
      status: 'pending'
    };

    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('project-submissions', JSON.stringify(updatedSubmissions));

    // Reset form
    setFiles([]);
    setCodeUrl('');
    setLiveUrl('');
    setNotes('');
    setShowSubmitModal(false);
    setSelectedProject(null);
    setActiveTab('submitted');
    
    alert('Project submitted successfully!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const availableProjects = projects.filter(
    p => !submissions.some(s => s.projectId === p.id)
  );

  // Filter for projects that have been submitted
  // const submittedProjects = projects.filter(
  //   p => submissions.some(s => s.projectId === p.id)
  // );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'available'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Available Projects ({availableProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'submitted'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            My Submissions ({submissions.length})
          </button>
        </div>

        {/* Available Projects */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableProjects.map(project => {
              const daysLeft = getDaysUntilDue(project.dueDate);
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">{project.courseName}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        daysLeft < 3 ? 'bg-red-100 text-red-700' :
                        daysLeft < 7 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {daysLeft} days left
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{project.description}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {project.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="text-indigo-600 mr-2">✓</span>
                            <span>{req}</span>
                          </li>
                        ))}
                        {project.requirements.length > 3 && (
                          <li className="text-sm text-gray-500">
                            +{project.requirements.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Max Score</p>
                        <p className="text-lg font-bold text-indigo-600">
                          {project.maxScore} pts
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowSubmitModal(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                      >
                        Submit Project
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submitted Projects */}
        {activeTab === 'submitted' && (
          <div className="space-y-6">
            {submissions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No submissions yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start working on available projects and submit your work!
                </p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  View Available Projects
                </button>
              </div>
            ) : (
              submissions.map(submission => {
                const project = projects.find(p => p.id === submission.projectId);
                if (!project) return null;

                return (
                  <div
                    key={submission.id}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600">{project.courseName}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-semibold ${
                        submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                        submission.status === 'needsRevision' ? 'bg-orange-100 text-orange-700' :
                        submission.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {submission.status === 'pending' ? '⏳ Pending Review' :
                         submission.status === 'reviewed' ? '👀 Reviewed' :
                         submission.status === 'approved' ? '✅ Approved' :
                         '⚠️ Needs Revision'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      {/* Submission Details */}
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">
                          Submitted Files
                        </h4>
                        {submission.files.length > 0 ? (
                          <ul className="space-y-1">
                            {submission.files.map((file, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center">
                                <span className="mr-2">📄</span>
                                {file.name} ({formatFileSize(file.size)})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No files</p>
                        )}
                      </div>

                      {/* URLs */}
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Links</h4>
                        {submission.codeUrl && (
                          <a
                            href={submission.codeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-700 block mb-1"
                          >
                            🔗 Code Repository
                          </a>
                        )}
                        {submission.liveUrl && (
                          <a
                            href={submission.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-700 block"
                          >
                            🌐 Live Demo
                          </a>
                        )}
                        {!submission.codeUrl && !submission.liveUrl && (
                          <p className="text-sm text-gray-500">No links provided</p>
                        )}
                      </div>

                      {/* Score */}
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Score</h4>
                        {submission.score !== undefined ? (
                          <div className="text-3xl font-bold text-indigo-600">
                            {submission.score}/{project.maxScore}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Not graded yet</p>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {submission.notes && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">
                          Your Notes
                        </h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {submission.notes}
                        </p>
                      </div>
                    )}

                    {/* Feedback */}
                    {submission.feedback && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">
                          Instructor Feedback
                        </h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700 mb-2">{submission.feedback}</p>
                          {submission.feedbackDate && (
                            <p className="text-xs text-gray-500">
                              Reviewed on {new Date(submission.feedbackDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Submit Project
                  </h2>
                  <p className="text-gray-600">{selectedProject.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedProject(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* File Upload */}
                {selectedProject.submissionTypes.includes('file') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Upload Files
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer"
                      >
                        <div className="text-4xl mb-2">📁</div>
                        <p className="text-sm font-semibold text-gray-700">
                          Click to upload files
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          or drag and drop
                        </p>
                      </label>
                    </div>
                    {files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {files.map((file, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            📄 {file.name} ({formatFileSize(file.size)})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Code URL */}
                {selectedProject.submissionTypes.includes('code') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Code Repository URL (GitHub, GitLab, etc.)
                    </label>
                    <input
                      type="url"
                      value={codeUrl}
                      onChange={(e) => setCodeUrl(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Live URL */}
                {selectedProject.submissionTypes.includes('url') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Live Demo URL (optional)
                    </label>
                    <input
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://yourproject.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information for the instructor..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowSubmitModal(false);
                      setSelectedProject(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitProject}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                  >
                    Submit Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSubmissions;
