import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerRole: 'student' | 'instructor';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  archived?: boolean;
}

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'students' | 'instructors'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'unread' | 'name'>('recent');
  const [showArchived, setShowArchived] = useState(false);
  const [showConversationMenu, setShowConversationMenu] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const currentUserId = 'current-user';
  const currentUserName = currentUser.name || 'Student';
  const currentUserAvatar = currentUserProfile.avatar || '👤';

  useEffect(() => {
    loadConversations();
    loadMessages();

    // Simulate receiving new messages
    const interval = setInterval(() => {
      // Randomly simulate incoming messages (for demo purposes)
      if (Math.random() > 0.95) {
        receiveRandomMessage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = () => {
    const stored = localStorage.getItem('messageConversations');
    
    const defaultConversations: Conversation[] = [
      {
        id: '1',
        partnerId: 'instructor-1',
        partnerName: 'Dr. Sarah Johnson',
        partnerAvatar: '👩‍🏫',
        partnerRole: 'instructor',
        lastMessage: 'Great progress on your React project! Keep it up.',
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 0,
        online: true
      },
      {
        id: '2',
        partnerId: 'instructor-2',
        partnerName: 'Prof. Michael Chen',
        partnerAvatar: '👨‍🏫',
        partnerRole: 'instructor',
        lastMessage: 'The assignment deadline has been extended to next week.',
        lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
        unreadCount: 2,
        online: false
      },
      {
        id: '3',
        partnerId: 'student-1',
        partnerName: 'Alex Martinez',
        partnerAvatar: '👨‍💻',
        partnerRole: 'student',
        lastMessage: 'Hey! Want to collaborate on the group project?',
        lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
        unreadCount: 1,
        online: true
      },
      {
        id: '4',
        partnerId: 'student-2',
        partnerName: 'Emma Wilson',
        partnerAvatar: '👩‍💻',
        partnerRole: 'student',
        lastMessage: 'Thanks for the study notes! They were really helpful.',
        lastMessageTime: new Date(Date.now() - 172800000).toISOString(),
        unreadCount: 0,
        online: false
      },
      {
        id: '5',
        partnerId: 'instructor-3',
        partnerName: 'Dr. James Rodriguez',
        partnerAvatar: '👨‍🏫',
        partnerRole: 'instructor',
        lastMessage: 'Office hours this Friday 2-4 PM if you need help.',
        lastMessageTime: new Date(Date.now() - 259200000).toISOString(),
        unreadCount: 0,
        online: true
      }
    ];

    setConversations(stored ? JSON.parse(stored) : defaultConversations);
  };

  const loadMessages = () => {
    const stored = localStorage.getItem('messageHistory');
    
    const defaultMessages: { [key: string]: Message[] } = {
      '1': [
        {
          id: 'm1',
          senderId: 'current-user',
          senderName: currentUserName,
          senderAvatar: currentUserAvatar,
          content: 'Hi Dr. Johnson, I have a question about the useEffect hook.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true
        },
        {
          id: 'm2',
          senderId: 'instructor-1',
          senderName: 'Dr. Sarah Johnson',
          senderAvatar: '👩‍🏫',
          content: 'Sure! What would you like to know?',
          timestamp: new Date(Date.now() - 7000000).toISOString(),
          read: true
        },
        {
          id: 'm3',
          senderId: 'current-user',
          senderName: currentUserName,
          senderAvatar: currentUserAvatar,
          content: 'When should I use cleanup functions in useEffect? I\'m not sure if my component needs one.',
          timestamp: new Date(Date.now() - 6800000).toISOString(),
          read: true
        },
        {
          id: 'm4',
          senderId: 'instructor-1',
          senderName: 'Dr. Sarah Johnson',
          senderAvatar: '👩‍🏫',
          content: 'Good question! Use cleanup functions when:\n\n1. Setting up subscriptions or event listeners\n2. Using timers (setTimeout, setInterval)\n3. Making API calls that can be cancelled\n4. Any side effect that needs to be "undone"\n\nThe cleanup function runs before the component unmounts or before the effect runs again.',
          timestamp: new Date(Date.now() - 6600000).toISOString(),
          read: true
        },
        {
          id: 'm5',
          senderId: 'current-user',
          senderName: currentUserName,
          senderAvatar: currentUserAvatar,
          content: 'That makes sense! Thank you for the clear explanation.',
          timestamp: new Date(Date.now() - 6400000).toISOString(),
          read: true
        },
        {
          id: 'm6',
          senderId: 'instructor-1',
          senderName: 'Dr. Sarah Johnson',
          senderAvatar: '👩‍🏫',
          content: 'Great progress on your React project! Keep it up.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true
        }
      ],
      '2': [
        {
          id: 'm7',
          senderId: 'instructor-2',
          senderName: 'Prof. Michael Chen',
          senderAvatar: '👨‍🏫',
          content: 'Hello everyone! I wanted to let you know about a change.',
          timestamp: new Date(Date.now() - 7300000).toISOString(),
          read: false
        },
        {
          id: 'm8',
          senderId: 'instructor-2',
          senderName: 'Prof. Michael Chen',
          senderAvatar: '👨‍🏫',
          content: 'The assignment deadline has been extended to next week.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: false
        }
      ],
      '3': [
        {
          id: 'm9',
          senderId: 'student-1',
          senderName: 'Alex Martinez',
          senderAvatar: '👨‍💻',
          content: 'Hey! Want to collaborate on the group project?',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: false
        }
      ],
      '4': [
        {
          id: 'm10',
          senderId: 'current-user',
          senderName: currentUserName,
          senderAvatar: currentUserAvatar,
          content: 'Here are the study notes from today\'s lecture.',
          timestamp: new Date(Date.now() - 173000000).toISOString(),
          read: true
        },
        {
          id: 'm11',
          senderId: 'student-2',
          senderName: 'Emma Wilson',
          senderAvatar: '👩‍💻',
          content: 'Thanks for the study notes! They were really helpful.',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true
        }
      ],
      '5': [
        {
          id: 'm12',
          senderId: 'instructor-3',
          senderName: 'Dr. James Rodriguez',
          senderAvatar: '👨‍🏫',
          content: 'Office hours this Friday 2-4 PM if you need help.',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          read: true
        }
      ]
    };

    setMessages(stored ? JSON.parse(stored) : defaultMessages);
  };

  const saveData = (updatedConversations: Conversation[], updatedMessages: { [key: string]: Message[] }) => {
    setConversations(updatedConversations);
    setMessages(updatedMessages);
    localStorage.setItem('messageConversations', JSON.stringify(updatedConversations));
    localStorage.setItem('messageHistory', JSON.stringify(updatedMessages));
  };

  const sendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true
    };

    const updatedMessages = {
      ...messages,
      [selectedConversation.id]: [...(messages[selectedConversation.id] || []), message]
    };

    const updatedConversations = conversations.map(c =>
      c.id === selectedConversation.id
        ? { ...c, lastMessage: message.content, lastMessageTime: message.timestamp }
        : c
    );

    saveData(updatedConversations, updatedMessages);
    setNewMessage('');
  };

  const receiveRandomMessage = () => {
    if (conversations.length === 0) return;

    const randomConv = conversations[Math.floor(Math.random() * conversations.length)];
    const demoMessages = [
      'Hi! How are you doing?',
      'Did you complete the assignment?',
      'Let\'s schedule a study session!',
      'I found this really helpful resource.',
      'Can you explain this concept?'
    ];

    const message: Message = {
      id: Date.now().toString(),
      senderId: randomConv.partnerId,
      senderName: randomConv.partnerName,
      senderAvatar: randomConv.partnerAvatar,
      content: demoMessages[Math.floor(Math.random() * demoMessages.length)],
      timestamp: new Date().toISOString(),
      read: selectedConversation?.id === randomConv.id
    };

    const updatedMessages = {
      ...messages,
      [randomConv.id]: [...(messages[randomConv.id] || []), message]
    };

    const updatedConversations = conversations.map(c =>
      c.id === randomConv.id
        ? {
            ...c,
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
            unreadCount: selectedConversation?.id === c.id ? 0 : c.unreadCount + 1
          }
        : c
    );

    saveData(updatedConversations, updatedMessages);
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowConversationMenu(null);

    // Mark messages as read
    const updatedMessages = {
      ...messages,
      [conversation.id]: (messages[conversation.id] || []).map(m => ({ ...m, read: true }))
    };

    const updatedConversations = conversations.map(c =>
      c.id === conversation.id ? { ...c, unreadCount: 0 } : c
    );

    saveData(updatedConversations, updatedMessages);
  };

  const archiveConversation = (conversationId: string) => {
    const updatedConversations = conversations.map(c =>
      c.id === conversationId ? { ...c, archived: !c.archived } : c
    );
    saveData(updatedConversations, messages);
    setShowConversationMenu(null);
  };

  const deleteConversation = (conversationId: string) => {
    if (!window.confirm('Are you sure you want to delete this conversation? This cannot be undone.')) {
      return;
    }
    
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    const updatedMessages = { ...messages };
    delete updatedMessages[conversationId];
    
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
    }
    
    saveData(updatedConversations, updatedMessages);
    setShowConversationMenu(null);
  };

  const exportConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    const conversationMessages = messages[conversationId] || [];
    
    if (!conversation) return;
    
    const exportText = `Conversation with ${conversation.partnerName}\n` +
      `Exported: ${new Date().toLocaleString()}\n` +
      `\n${'='.repeat(50)}\n\n` +
      conversationMessages.map(msg => 
        `[${formatTime(msg.timestamp)}] ${msg.senderName}:\n${msg.content}\n`
      ).join('\n');
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversation.partnerName.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowConversationMenu(null);
  };

  let filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === 'all' ||
      (filterRole === 'instructors' && conv.partnerRole === 'instructor') ||
      (filterRole === 'students' && conv.partnerRole === 'student');
    const matchesArchived = showArchived ? conv.archived === true : !conv.archived;
    return matchesSearch && matchesRole && matchesArchived;
  });

  // Sort conversations
  if (sortBy === 'recent') {
    filteredConversations.sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
  } else if (sortBy === 'unread') {
    filteredConversations.sort((a, b) => b.unreadCount - a.unreadCount);
  } else if (sortBy === 'name') {
    filteredConversations.sort((a, b) => a.partnerName.localeCompare(b.partnerName));
  }

  // Filter messages by search term
  const filteredMessages = selectedConversation
    ? (messages[selectedConversation.id] || []).filter(msg =>
        msg.content.toLowerCase().includes(messageSearchTerm.toLowerCase()) ||
        msg.senderName.toLowerCase().includes(messageSearchTerm.toLowerCase())
      )
    : [];

  const totalUnread = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Messages</h1>
              <p className="text-indigo-100">Connect with instructors and fellow students</p>
            </div>
            {totalUnread > 0 && (
              <div className="bg-white text-indigo-600 rounded-full px-6 py-3 font-bold text-lg">
                {totalUnread} Unread
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search and Filter */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-3">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterRole('all')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterRole === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterRole('instructors')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterRole === 'instructors'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Instructors
                  </button>
                  <button
                    onClick={() => setFilterRole('students')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterRole === 'students'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Students
                  </button>
                </div>

                {/* Sort and Archive Controls */}
                <div className="flex gap-2 mt-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="recent">🕒 Recent</option>
                    <option value="unread">📬 Unread First</option>
                    <option value="name">🔤 By Name</option>
                  </select>
                  
                  <button
                    onClick={() => setShowArchived(!showArchived)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      showArchived
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📦 {showArchived ? 'Archived' : 'Active'}
                  </button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                      selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3" onClick={() => selectConversation(conversation)}>
                      <div className="relative">
                        <div className="text-3xl">{conversation.partnerAvatar}</div>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 truncate pr-6">{conversation.partnerName}</h3>
                          <span className="text-xs text-gray-500">{timeAgo(conversation.lastMessageTime)}</span>
                        </div>

                        <p className="text-sm text-gray-600 truncate mb-1">{conversation.lastMessage}</p>

                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              conversation.partnerRole === 'instructor'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {conversation.partnerRole}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 font-medium">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Conversation Menu */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowConversationMenu(showConversationMenu === conversation.id ? null : conversation.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      {showConversationMenu === conversation.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              archiveConversation(conversation.id);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg"
                          >
                            📦 {conversation.archived ? 'Unarchive' : 'Archive'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              exportConversation(conversation.id);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            📥 Export
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conversation.id);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 rounded-b-lg"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredConversations.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-2">💬</div>
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="text-4xl">{selectedConversation.partnerAvatar}</div>
                        {selectedConversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="font-bold text-gray-800 text-lg">{selectedConversation.partnerName}</h2>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.online ? '🟢 Online' : '⚫ Offline'} •{' '}
                          {selectedConversation.partnerRole}
                        </p>
                      </div>
                    </div>
                    
                    {/* Message Search */}
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                        placeholder="Search in conversation..."
                        value={messageSearchTerm}
                        onChange={(e) => setMessageSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {filteredMessages.map((message) => {
                      const isCurrentUser = message.senderId === currentUserId;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <div className="text-2xl flex-shrink-0">{message.senderAvatar}</div>
                            <div>
                              {!isCurrentUser && (
                                <div className="text-xs text-gray-600 mb-1">{message.senderName}</div>
                              )}
                              <div
                                className={`rounded-2xl px-4 py-2 ${
                                  isCurrentUser
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-2">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        rows={2}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold mb-2">Select a Conversation</h3>
                    <p>Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
