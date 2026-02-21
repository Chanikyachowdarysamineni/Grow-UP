import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const AITutor: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  useEffect(() => {
    // Load conversations from localStorage
    const saved = localStorage.getItem('ai_tutor_conversations');
    if (saved) {
      const parsed = JSON.parse(saved);
      const conversationsWithDates = parsed.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setConversations(conversationsWithDates);
    }
  }, []);

  useEffect(() => {
    // Save conversations to localStorage
    if (conversations.length > 0) {
      localStorage.setItem('ai_tutor_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [{
        id: '1',
        role: 'system',
        content: 'Hello! I\'m your AI tutor. Ask me anything about programming, web development, or any topic you\'re learning. I can help explain concepts, debug code, or provide learning guidance.',
        timestamp: new Date()
      }],
      createdAt: new Date()
    };
    setConversations([newConv, ...conversations]);
    setCurrentConversation(newConv);
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentConversation || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage]
    };

    // Update title if first user message
    if (currentConversation.messages.length === 1) {
      updatedConversation.title = input.slice(0, 50) + (input.length > 50 ? '...' : '');
    }

    setCurrentConversation(updatedConversation);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call to ChatGPT
      // In production, this would call your backend which calls OpenAI API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(input),
        timestamp: new Date()
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiResponse]
      };

      setCurrentConversation(finalConversation);
      setConversations(prev => 
        prev.map(c => c.id === finalConversation.id ? finalConversation : c)
      );
    } catch (error) {
      console.error('Error calling AI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();
    
    if (lower.includes('react') || lower.includes('component')) {
      return `Great question about React! React components are the building blocks of your application. Here's a breakdown:\n\n**Functional Components:**\n\`\`\`jsx\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n\`\`\`\n\n**Key Concepts:**\n1. Components let you split the UI into independent, reusable pieces\n2. They accept inputs (props) and return React elements\n3. Use hooks like useState and useEffect for state and side effects\n\nWould you like me to explain any specific aspect in more detail?`;
    }
    
    if (lower.includes('closure') || lower.includes('javascript')) {
      return `Closures are a fundamental JavaScript concept! A closure is created when a function has access to variables from an outer function's scope, even after the outer function has returned.\n\n**Example:**\n\`\`\`javascript\nfunction outer() {\n  let count = 0;\n  return function inner() {\n    count++;\n    return count;\n  }\n}\n\nconst counter = outer();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n\`\`\`\n\nThe inner function "closes over" the count variable, maintaining access to it. This is useful for data privacy and creating factory functions!`;
    }
    
    if (lower.includes('debug') || lower.includes('error') || lower.includes('fix')) {
      return `I'd be happy to help debug! When troubleshooting code:\n\n**Steps to Debug:**\n1. Read the error message carefully - it often tells you exactly what's wrong\n2. Check the line number and surrounding code\n3. Use console.log() to trace variable values\n4. Verify syntax (brackets, semicolons, quotes)\n5. Check for typos in variable/function names\n\nCan you share the specific error message or code you're working with? I'll provide targeted help!`;
    }
    
    if (lower.includes('api') || lower.includes('fetch') || lower.includes('axios')) {
      return `Making API calls in JavaScript can be done with fetch or axios:\n\n**Using Fetch:**\n\`\`\`javascript\nfetch('https://api.example.com/data')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error('Error:', error));\n\`\`\`\n\n**Using Async/Await:**\n\`\`\`javascript\nasync function getData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n\`\`\`\n\nWhat kind of API are you working with?`;
    }
    
    return `That's an interesting question! Based on what you're asking about "${userInput}", I can help you understand it better.\n\nCould you provide more context about:\n- What you're trying to accomplish\n- What you've tried so far\n- Any specific challenges you're facing\n\nThis will help me give you the most relevant and helpful explanation!`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-4 flex items-center">
            <span className="text-2xl mr-2">🤖</span>
            AI Tutor
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <button
            onClick={createNewConversation}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold mb-4"
          >
            + New Chat
          </button>

          <div className="space-y-2">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`p-3 rounded-lg cursor-pointer group relative ${
                  currentConversation?.id === conv.id
                    ? 'bg-indigo-50 border border-indigo-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setCurrentConversation(conv)}
              >
                <p className="text-sm font-semibold text-gray-900 truncate pr-6">
                  {conv.title}
                </p>
                <p className="text-xs text-gray-500">
                  {conv.messages.length - 1} messages
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {currentConversation.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-2xl rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : message.role === 'system'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold ml-2 flex-shrink-0">
                      ME
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2">
                    AI
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end space-x-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about programming, concepts, or debugging..."
                    className="flex-1 resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className={`px-6 py-3 rounded-lg font-semibold ${
                      input.trim() && !isLoading
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Send
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AI Tutor</h2>
              <p className="text-gray-600 mb-6">
                Start a new conversation to get help with your learning
              </p>
              <button
                onClick={createNewConversation}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITutor;
