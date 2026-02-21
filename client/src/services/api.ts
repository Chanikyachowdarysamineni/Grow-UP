import io, { Socket } from 'socket.io-client';

// API Server URLs
const REALTIME_API_URL = 'http://localhost:5000';  // Real-time server: Auth, WebSockets, Database
const CODE_EXECUTION_API_URL = 'http://localhost:3001'; // Code execution server: Execute code, file management
let socket: Socket | null = null;
let socketInitialized = false;

// Check if real-time server is available
const checkServerAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${REALTIME_API_URL}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.warn('⚠️ Real-time server not available yet. Will retry...');
    return false;
  }
};

// Initialize Socket.IO connection with authentication
export const initializeSocket = async (userId: string, token?: string) => {
  // Avoid multiple initialization attempts
  if (socketInitialized) {
    return socket;
  }

  socketInitialized = true;

  try {
    // Check if server is available first
    const serverAvailable = await checkServerAvailability();
    
    if (!serverAvailable) {
      console.warn('⚠️ Real-time server is not running on ' + REALTIME_API_URL);
      console.warn('📝 Please start the real-time server: node realtime-server.js');
      // Don't throw error, allow app to function without real-time features
      return null;
    }

    if (!socket) {
      socket = io(REALTIME_API_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        autoConnect: true,
      });

      socket.on('connect', () => {
        console.log('✅ Connected to real-time server');
        // Send user online with token for authentication
        socket?.emit('user:online', { userId, token });
      });

      socket.on('disconnect', () => {
        console.log('⚠️ Disconnected from real-time server');
      });

      socket.on('connect_error', (error) => {
        console.warn('⚠️ Socket connection error:', error);
      });

      socket.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });
    }

    return socket;
  } catch (error) {
    console.error('❌ Failed to initialize socket:', error);
    socketInitialized = false;
    return null;
  }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  socketInitialized = false;
};

// API Helper - for real-time server (port 5000)
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${REALTIME_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'API Error');
  }

  return response.json();
};

// API Helper - for code execution server (port 3001)
const executeCodeApiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${CODE_EXECUTION_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'API Error');
  }

  return response.json();
};

// ==================== AUTH API ====================

export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// ==================== PROFILE API ====================

export const profileAPI = {
  get: async (userId: string) => {
    return apiCall(`/api/profile/${userId}`);
  },

  update: async (userId: string, data: any) => {
    return apiCall(`/api/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ==================== PROGRESS API ====================

export const progressAPI = {
  get: async (userId: string) => {
    return apiCall(`/api/progress/${userId}`);
  },

  update: async (userId: string, data: any) => {
    return apiCall(`/api/progress/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateCourse: async (userId: string, courseProgress: any) => {
    return apiCall(`/api/progress/${userId}/course`, {
      method: 'POST',
      body: JSON.stringify(courseProgress),
    });
  },
};

// ==================== BOOKMARKS API ====================

export const bookmarksAPI = {
  get: async (userId: string) => {
    return apiCall(`/api/bookmarks/${userId}`);
  },

  add: async (userId: string, type: 'course' | 'lesson', item: any) => {
    return apiCall(`/api/bookmarks/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ type, item }),
    });
  },

  remove: async (userId: string, type: 'course' | 'lesson', itemId: string) => {
    return apiCall(`/api/bookmarks/${userId}/${type}/${itemId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== NOTES API ====================

export const notesAPI = {
  getAll: async (userId: string) => {
    return apiCall(`/api/notes/${userId}`);
  },

  create: async (note: any) => {
    return apiCall('/api/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  },

  update: async (noteId: string, data: any) => {
    return apiCall(`/api/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (noteId: string) => {
    return apiCall(`/api/notes/${noteId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== FORUMS API ====================

export const forumsAPI = {
  getThreads: async () => {
    return apiCall('/api/forums/threads');
  },

  getThread: async (threadId: string) => {
    return apiCall(`/api/forums/threads/${threadId}`);
  },

  createThread: async (thread: any) => {
    return apiCall('/api/forums/threads', {
      method: 'POST',
      body: JSON.stringify(thread),
    });
  },

  createReply: async (threadId: string, reply: any) => {
    return apiCall(`/api/forums/threads/${threadId}/replies`, {
      method: 'POST',
      body: JSON.stringify(reply),
    });
  },

  upvote: async (itemId: string) => {
    return apiCall(`/api/forums/${itemId}/upvote`, {
      method: 'POST',
    });
  },

  acceptReply: async (replyId: string) => {
    return apiCall(`/api/forums/replies/${replyId}/accept`, {
      method: 'POST',
    });
  },
};

// ==================== MESSAGES API ====================

export const messagesAPI = {
  getConversations: async (userId: string) => {
    return apiCall(`/api/messages/conversations/${userId}`);
  },

  getMessages: async (conversationId: string) => {
    return apiCall(`/api/messages/${conversationId}`);
  },

  createConversation: async (conversation: any) => {
    return apiCall('/api/messages/conversation', {
      method: 'POST',
      body: JSON.stringify(conversation),
    });
  },

  sendMessage: async (message: any) => {
    // Send through Socket.IO for real-time delivery
    if (socket) {
      socket.emit('message:send', message);
    }
    
    // Also save to database
    return apiCall('/api/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },

  markAsRead: async (messageId: string) => {
    return apiCall(`/api/messages/${messageId}/read`, {
      method: 'PUT',
    });
  },
};

// ==================== COURSES API ====================

export const coursesAPI = {
  getAll: async () => {
    return apiCall('/api/courses');
  },

  get: async (courseId: string) => {
    return apiCall(`/api/courses/${courseId}`);
  },
};

// ==================== CODE EXECUTION API ====================

export const executeCode = async (language: string, code: string, input?: string) => {
  return executeCodeApiCall('/api/execute', {
    method: 'POST',
    body: JSON.stringify({ language, code, input }),
  });
};

// ==================== REAL-TIME EVENT LISTENERS ====================

export const subscribeToMessages = (callback: (message: any) => void) => {
  socket?.on('message:receive', callback);
};

export const unsubscribeFromMessages = () => {
  socket?.off('message:receive');
};

export const subscribeToUserStatus = (callback: (data: { userId: string; status: string }) => void) => {
  socket?.on('user:status', callback);
};

export const subscribeToForumUpdates = (callbacks: {
  onThreadCreated?: (thread: any) => void;
  onReplyAdded?: (data: any) => void;
  onUpvoted?: (data: any) => void;
}) => {
  if (callbacks.onThreadCreated) {
    socket?.on('forum:thread-created', callbacks.onThreadCreated);
  }
  if (callbacks.onReplyAdded) {
    socket?.on('forum:reply-added', callbacks.onReplyAdded);
  }
  if (callbacks.onUpvoted) {
    socket?.on('forum:upvoted', callbacks.onUpvoted);
  }
};

export const sendTypingIndicator = (conversationId: string, userId: string, typing: boolean) => {
  if (typing) {
    socket?.emit('typing:start', { conversationId, userId });
  } else {
    socket?.emit('typing:stop', { conversationId, userId });
  }
};
