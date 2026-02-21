import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

interface ForumThread {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  createdAt: string;
  replies: Reply[];
  views: number;
  upvotes: number;
  upvoted: boolean;
  solved: boolean;
}

interface Reply {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  upvotes: number;
  upvoted: boolean;
  isAccepted: boolean;
}

const Forums: React.FC = () => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showMyThreadsOnly, setShowMyThreadsOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'unanswered'>('newest');
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: [] as string[]
  });
  const [newReply, setNewReply] = useState('');
  const [newTag, setNewTag] = useState('');

  const categories = ['all', 'General', 'JavaScript', 'React', 'Python', 'Career', 'Projects'];

  useEffect(() => {
    loadForums();
  }, []);

  const loadForums = () => {
    const storedThreads = localStorage.getItem('forumThreads');
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = currentUser.name || 'Student';
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const userAvatar = userProfile.avatar || '👤';

    const defaultThreads: ForumThread[] = [
      {
        id: '1',
        title: 'How to optimize React performance with useMemo and useCallback?',
        content: 'I\'m building a large React application and noticing some performance issues. I\'ve heard about useMemo and useCallback but I\'m not sure when to use each one. Can someone explain the difference and best practices?\n\nMy component re-renders frequently even when props haven\'t changed. Any advice would be appreciated!',
        author: 'Alex Chen',
        authorAvatar: '👨‍💻',
        category: 'React',
        tags: ['react', 'performance', 'hooks'],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        views: 127,
        upvotes: 8,
        upvoted: false,
        solved: true,
        replies: [
          {
            id: 'r1',
            content: 'Great question! Here\'s the key difference:\n\n**useMemo**: Memoizes the *result* of a calculation\n**useCallback**: Memoizes the *function* itself\n\nUse useMemo when you have expensive computations that don\'t need to run on every render. Use useCallback when passing functions as props to child components to prevent unnecessary re-renders.\n\nExample:\n```javascript\nconst expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);\nconst memoizedCallback = useCallback(() => doSomething(a), [a]);\n```',
            author: 'Sarah Johnson',
            authorAvatar: '👩‍💻',
            createdAt: new Date(Date.now() - 3000000).toISOString(),
            upvotes: 12,
            upvoted: false,
            isAccepted: true
          },
          {
            id: 'r2',
            content: 'Also remember to use React DevTools Profiler to identify actual performance bottlenecks before optimizing. Premature optimization can make code harder to read!',
            author: 'Mike Davis',
            authorAvatar: '🧑‍🎓',
            createdAt: new Date(Date.now() - 2400000).toISOString(),
            upvotes: 5,
            upvoted: false,
            isAccepted: false
          }
        ]
      },
      {
        id: '2',
        title: 'Best resources for learning Python for beginners?',
        content: 'I\'m completely new to programming and want to start with Python. What are the best resources (free or paid) you\'d recommend? I prefer video courses but open to books too.',
        author: 'Emma Wilson',
        authorAvatar: '🧑‍🎓',
        category: 'Python',
        tags: ['python', 'beginner', 'resources'],
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        views: 95,
        upvotes: 6,
        upvoted: false,
        solved: false,
        replies: [
          {
            id: 'r3',
            content: 'I started with "Automate the Boring Stuff with Python" - it\'s free online and super practical! Also check out Python\'s official tutorial and then move to projects.',
            author: 'David Kim',
            authorAvatar: '👨‍🎓',
            createdAt: new Date(Date.now() - 6600000).toISOString(),
            upvotes: 7,
            upvoted: false,
            isAccepted: false
          }
        ]
      },
      {
        id: '3',
        title: 'How to prepare for technical interviews as a self-taught developer?',
        content: 'I\'ve been learning to code for about 8 months now and feel ready to start applying for junior positions. What should I focus on for technical interviews? LeetCode? System design? Projects?\n\nAny advice from people who\'ve been through this?',
        author: userName,
        authorAvatar: userAvatar,
        category: 'Career',
        tags: ['career', 'interview', 'advice'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        views: 203,
        upvotes: 15,
        upvoted: false,
        solved: false,
        replies: [
          {
            id: 'r4',
            content: 'Focus on these areas:\n1. Data structures & algorithms (LeetCode easy/medium)\n2. Build 2-3 solid projects you can explain in detail\n3. Practice explaining your problem-solving process\n4. Review fundamentals of your primary language\n5. Mock interviews with friends\n\nSystem design is usually for senior roles, so focus on fundamentals first!',
            author: 'Jennifer Lee',
            authorAvatar: '👩‍💼',
            createdAt: new Date(Date.now() - 82800000).toISOString(),
            upvotes: 18,
            upvoted: true,
            isAccepted: false
          },
          {
            id: 'r5',
            content: 'Also practice behavioral questions! Being able to communicate well is just as important as coding skills.',
            author: 'Tom Rodriguez',
            authorAvatar: '👨‍💻',
            createdAt: new Date(Date.now() - 79200000).toISOString(),
            upvotes: 9,
            upvoted: false,
            isAccepted: false
          }
        ]
      }
    ];

    setThreads(storedThreads ? JSON.parse(storedThreads) : defaultThreads);
  };

  const saveThreads = (updatedThreads: ForumThread[]) => {
    setThreads(updatedThreads);
    localStorage.setItem('forumThreads', JSON.stringify(updatedThreads));
  };

  const createThread = () => {
    if (!newThread.title || !newThread.content) {
      alert('Please fill in title and content');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    const thread: ForumThread = {
      id: Date.now().toString(),
      ...newThread,
      author: currentUser.name || 'Student',
      authorAvatar: userProfile.avatar || '👤',
      createdAt: new Date().toISOString(),
      replies: [],
      views: 0,
      upvotes: 0,
      upvoted: false,
      solved: false
    };

    saveThreads([thread, ...threads]);
    setNewThread({ title: '', content: '', category: 'General', tags: [] });
    setIsCreatingThread(false);
  };

  const addReply = (threadId: string) => {
    if (!newReply.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    const reply: Reply = {
      id: Date.now().toString(),
      content: newReply,
      author: currentUser.name || 'Student',
      authorAvatar: userProfile.avatar || '👤',
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvoted: false,
      isAccepted: false
    };

    const updatedThreads = threads.map(t =>
      t.id === threadId ? { ...t, replies: [...t.replies, reply] } : t
    );

    saveThreads(updatedThreads);
    setNewReply('');
    
    if (selectedThread && selectedThread.id === threadId) {
      setSelectedThread({ ...selectedThread, replies: [...selectedThread.replies, reply] });
    }
  };

  const toggleThreadUpvote = (threadId: string) => {
    const updatedThreads = threads.map(t =>
      t.id === threadId
        ? { ...t, upvotes: t.upvoted ? t.upvotes - 1 : t.upvotes + 1, upvoted: !t.upvoted }
        : t
    );
    saveThreads(updatedThreads);
    
    if (selectedThread && selectedThread.id === threadId) {
      setSelectedThread({
        ...selectedThread,
        upvotes: selectedThread.upvoted ? selectedThread.upvotes - 1 : selectedThread.upvotes + 1,
        upvoted: !selectedThread.upvoted
      });
    }
  };

  const toggleReplyUpvote = (threadId: string, replyId: string) => {
    const updatedThreads = threads.map(t =>
      t.id === threadId
        ? {
            ...t,
            replies: t.replies.map(r =>
              r.id === replyId
                ? { ...r, upvotes: r.upvoted ? r.upvotes - 1 : r.upvotes + 1, upvoted: !r.upvoted }
                : r
            )
          }
        : t
    );
    saveThreads(updatedThreads);

    if (selectedThread && selectedThread.id === threadId) {
      setSelectedThread({
        ...selectedThread,
        replies: selectedThread.replies.map(r =>
          r.id === replyId
            ? { ...r, upvotes: r.upvoted ? r.upvotes - 1 : r.upvotes + 1, upvoted: !r.upvoted }
            : r
        )
      });
    }
  };

  const markReplyAsAccepted = (threadId: string, replyId: string) => {
    const updatedThreads = threads.map(t =>
      t.id === threadId
        ? {
            ...t,
            solved: true,
            replies: t.replies.map(r => ({ ...r, isAccepted: r.id === replyId }))
          }
        : t
    );
    saveThreads(updatedThreads);

    if (selectedThread && selectedThread.id === threadId) {
      setSelectedThread({
        ...selectedThread,
        solved: true,
        replies: selectedThread.replies.map(r => ({ ...r, isAccepted: r.id === replyId }))
      });
    }
  };

  const incrementViews = (threadId: string) => {
    const updatedThreads = threads.map(t =>
      t.id === threadId ? { ...t, views: t.views + 1 } : t
    );
    saveThreads(updatedThreads);
  };

  const openThread = (thread: ForumThread) => {
    incrementViews(thread.id);
    const updated = threads.find(t => t.id === thread.id);
    setSelectedThread(updated || thread);
  };

  let sortedThreads = [...threads];
  if (sortBy === 'popular') {
    sortedThreads.sort((a, b) => b.upvotes - a.upvotes);
  } else if (sortBy === 'unanswered') {
    sortedThreads = sortedThreads.filter(t => t.replies.length === 0);
  } else {
    sortedThreads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const filteredThreads = sortedThreads.filter(thread => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const matchesSearch = thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || thread.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'solved' && thread.solved) ||
                         (filterStatus === 'unsolved' && !thread.solved);
    const matchesTag = filterTag === 'all' || thread.tags.includes(filterTag);
    const matchesMyThreads = !showMyThreadsOnly || thread.author === (currentUser.name || 'Student');
    return matchesSearch && matchesCategory && matchesStatus && matchesTag && matchesMyThreads;
  });

  // Get all unique tags from threads
  const allTags = Array.from(new Set(threads.flatMap(t => t.tags)));

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {!selectedThread ? (
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Discussion Forums</h1>
                  <p className="text-indigo-100">Ask questions, share knowledge, and connect with the community</p>
                </div>
                <button
                  onClick={() => setIsCreatingThread(true)}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  ✏️ New Thread
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
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
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="unanswered">Unanswered</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="solved">✓ Solved</option>
                  <option value="unsolved">Unsolved</option>
                </select>

                {/* Tag Filter */}
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                >
                  <option value="all">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>#{tag}</option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('detailed')}
                    className={`px-3 py-2 rounded transition-colors ${
                      viewMode === 'detailed'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Detailed View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('compact')}
                    className={`px-3 py-2 rounded transition-colors ${
                      viewMode === 'compact'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Compact View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Additional Filters Row */}
              <div className="flex gap-4 items-center">
                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap flex-1">
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

                {/* My Threads Toggle */}
                <button
                  onClick={() => setShowMyThreadsOnly(!showMyThreadsOnly)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    showMyThreadsOnly
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👤 My Threads
                </button>
              </div>
            </div>

            {/* Threads List */}
            <div className="space-y-4">
              {filteredThreads.map((thread) => {
                if (viewMode === 'compact') {
                  // Compact View
                  return (
                    <div
                      key={thread.id}
                      onClick={() => openThread(thread)}
                      className="bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="flex gap-3 items-start">
                        {/* Upvote Section - Compact */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleThreadUpvote(thread.id);
                            }}
                            className={`text-xl hover:scale-110 transition-transform ${
                              thread.upvoted ? 'text-indigo-600' : 'text-gray-400'
                            }`}
                          >
                            ⬆
                          </button>
                          <span className="font-bold text-sm text-gray-700">{thread.upvotes}</span>
                        </div>

                        {/* Thread Content - Compact */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-800 hover:text-indigo-600 truncate flex-1">
                              {thread.title}
                            </h3>
                            {thread.solved && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                                ✓ Solved
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                              {thread.category}
                            </span>
                            <span>{thread.authorAvatar} {thread.author}</span>
                            <span>•</span>
                            <span>👁️ {thread.views}</span>
                            <span>•</span>
                            <span>💬 {thread.replies.length}</span>
                            <span>•</span>
                            <span>{timeAgo(thread.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Detailed View
                return (
                <div
                  key={thread.id}
                  onClick={() => openThread(thread)}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex gap-4">
                    {/* Upvote Section */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleThreadUpvote(thread.id);
                        }}
                        className={`text-2xl hover:scale-110 transition-transform ${
                          thread.upvoted ? 'text-indigo-600' : 'text-gray-400'
                        }`}
                      >
                        ⬆
                      </button>
                      <span className="font-bold text-gray-700">{thread.upvotes}</span>
                    </div>

                    {/* Thread Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800 hover:text-indigo-600">
                          {thread.title}
                        </h3>
                        {thread.solved && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            ✓ Solved
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">{thread.content}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{thread.authorAvatar}</span>
                          <span>{thread.author}</span>
                        </div>
                        <span>•</span>
                        <span>{timeAgo(thread.createdAt)}</span>
                        <span>•</span>
                        <span>👁️ {thread.views} views</span>
                        <span>•</span>
                        <span>💬 {thread.replies.length} replies</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {thread.category}
                        </span>
                        {thread.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}

              {filteredThreads.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="text-6xl mb-4">💭</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Discussions Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' || filterTag !== 'all' || showMyThreadsOnly
                      ? 'Try adjusting your search or filters'
                      : 'Be the first to start a discussion!'}
                  </p>
                  <button
                    onClick={() => setIsCreatingThread(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Start a Discussion
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        // Thread Detail View
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setSelectedThread(null)}
            className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Forums
          </button>

          {/* Thread */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="flex gap-6">
              {/* Upvote */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => toggleThreadUpvote(selectedThread.id)}
                  className={`text-3xl hover:scale-110 transition-transform ${
                    selectedThread.upvoted ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                >
                  ⬆
                </button>
                <span className="font-bold text-xl text-gray-700">{selectedThread.upvotes}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-800">{selectedThread.title}</h1>
                  {selectedThread.solved && (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                      ✓ Solved
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedThread.authorAvatar}</span>
                    <span className="font-medium">{selectedThread.author}</span>
                  </div>
                  <span>•</span>
                  <span>{timeAgo(selectedThread.createdAt)}</span>
                  <span>•</span>
                  <span>👁️ {selectedThread.views} views</span>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap mb-6">{selectedThread.content}</p>

                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {selectedThread.category}
                  </span>
                  {selectedThread.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedThread.replies.length} {selectedThread.replies.length === 1 ? 'Reply' : 'Replies'}
            </h2>

            {selectedThread.replies.map((reply) => (
              <div
                key={reply.id}
                className={`bg-white rounded-xl shadow-sm p-6 ${reply.isAccepted ? 'ring-2 ring-green-500' : ''}`}
              >
                <div className="flex gap-6">
                  {/* Upvote */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => toggleReplyUpvote(selectedThread.id, reply.id)}
                      className={`text-2xl hover:scale-110 transition-transform ${
                        reply.upvoted ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    >
                      ⬆
                    </button>
                    <span className="font-bold text-gray-700">{reply.upvotes}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-2xl">{reply.authorAvatar}</span>
                        <span className="font-medium text-gray-800">{reply.author}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{timeAgo(reply.createdAt)}</span>
                      </div>

                      {reply.isAccepted ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ Accepted Answer
                        </span>
                      ) : (
                        <button
                          onClick={() => markReplyAsAccepted(selectedThread.id, reply.id)}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-green-100 hover:text-green-700 transition-colors"
                        >
                          Mark as Answer
                        </button>
                      )}
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Post a Reply</h3>
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Share your knowledge or ask for clarification..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none mb-4"
            />
            <button
              onClick={() => addReply(selectedThread.id)}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Post Reply
            </button>
          </div>
        </div>
      )}

      {/* Create Thread Modal */}
      {isCreatingThread && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsCreatingThread(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">Start a New Discussion</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newThread.title}
                  onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="What's your question or topic?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newThread.category}
                  onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                >
                  {categories.filter(c => c !== 'all').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  value={newThread.content}
                  onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                  placeholder="Describe your question or topic in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newThread.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        onClick={() =>
                          setNewThread({ ...newThread, tags: newThread.tags.filter((t) => t !== tag) })
                        }
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newTag.trim() && newThread.tags.length < 5) {
                        setNewThread({ ...newThread, tags: [...newThread.tags, newTag.trim()] });
                        setNewTag('');
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Add up to 5 tags..."
                  />
                  <button
                    onClick={() => {
                      if (newTag.trim() && newThread.tags.length < 5) {
                        setNewThread({ ...newThread, tags: [...newThread.tags, newTag.trim()] });
                        setNewTag('');
                      }
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={newThread.tags.length >= 5}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsCreatingThread(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createThread}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Post Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forums;
