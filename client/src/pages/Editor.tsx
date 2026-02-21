import React from 'react';

const Editor: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Text Editor</h1>
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <textarea
            className="w-full h-96 bg-gray-900 text-white p-4 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Start typing..."
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;

