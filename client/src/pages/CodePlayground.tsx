import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import EditorLayout from '../components/CodeEditor';
import '../components/CodeEditor/styles/styles.css';
import { useFileManager } from '../components/CodeEditor';
import type { FileData } from '../components/CodeEditor/hooks/useFileManager';

interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
}

const CodePlayground: React.FC = () => {
  const fileManager = useFileManager();
  const {
    files,
    currentFile,
    createFile,
    updateFile,
    deleteFile,
    switchFile,
    saveAll,
    hasUnsavedChanges,
    hasUnsavedFiles
  } = fileManager;

  const [output, setOutput] = useState('');
  const [input, setInput] = useState('')
;
  const [isRunning, setIsRunning] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const codeExamples: CodeExample[] = [
    {
      id: '1',
      title: 'Hello World - JavaScript',
      language: 'javascript',
      code: 'console.log("Hello, World!");',
      description: 'Basic JavaScript output'
    },
    {
      id: '2',
      title: 'Array Methods',
      language: 'javascript',
      code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`,
      description: 'Array transformation with map'
    },
    {
      id: '3',
      title: 'Python Lists',
      language: 'python',
      code: `numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(doubled)`,
      description: 'List comprehension in Python'
    },
    {
      id: '4',
      title: 'Async/Await',
      language: 'javascript',
      code: `async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
}`,
      description: 'Asynchronous JavaScript'
    }
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '📜' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚙️' },
    { value: 'go', label: 'Go', icon: '🔷' },
    { value: 'rust', label: 'Rust', icon: '🦀' },
  ];

  const runCode = async () => {
    if (!currentFile) return;
    
    setIsRunning(true);
    setOutput('⏳ Running...\n');

    try {
      const response = await fetch('http://localhost:3001/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          language: currentFile.language, 
          code: currentFile.content, 
          input 
        }),
      });

      const result = await response.json();
      
      if (result.error) {
        setOutput(`❌ Error:\n${result.error}`);
      } else {
        setOutput(`✅ Output:\n\n${result.output}\n\n⏱ Time: ${result.executionTime}ms`);
      }
    } catch (error) {
      setOutput(`❌ Connection Error\nMake sure the backend is running on http://localhost:3001`);
    } finally {
      setIsRunning(false);
    }
  };

  const saveCode = () => {
    if (currentFile) {
      saveAll();
    }
  };

  const loadCode = async (language: string, code: string, title: string) => {
    try {
      await createFile(title, language, code);
      setShowExamples(false);
    } catch (err) {
      alert('Failed to create file: ' + err);
    }
  };

  const createNewFile = async () => {
    const name = prompt('Enter file name:', 'untitled.js');
    if (!name) return;
    
    try {
      await createFile(name, 'javascript', '// Start coding...\n');
    } catch (err) {
      alert('Failed to create file: ' + err);
    }
  };

  const deleteFileHandler = async (fileId: string) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      await deleteFile(fileId);
    } catch (err) {
      alert('Failed to delete file: ' + err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-white font-bold">Code Editor</h1>
              {currentFile && (
                <span className="text-gray-400 text-sm">
                  📄 {currentFile.name}
                  {hasUnsavedChanges(currentFile.id) && <span className="text-blue-400 ml-2">●</span>}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={createNewFile}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition"
                title="Create new file"
              >
                + New File
              </button>

              <button
                onClick={() => setShowExamples(!showExamples)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold text-sm transition"
              >
                📚 Examples
              </button>

              <button
                onClick={saveCode}
                disabled={!currentFile || !hasUnsavedFiles}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition disabled:opacity-50"
              >
                💾 Save
              </button>

              <button
                onClick={runCode}
                disabled={!currentFile || isRunning}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition disabled:opacity-50"
              >
                {isRunning ? '⏳' : '▶️'} Run
              </button>
            </div>
          </div>

          {/* Examples Panel */}
          {showExamples && (
            <div className="bg-gray-800 border-b border-gray-700 p-4">
              <h3 className="text-white font-semibold mb-3">Code Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <button
                  onClick={() => loadCode('javascript', 'console.log("Hello, World!");', 'hello.js')}
                  className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm text-left transition"
                >
                  <div className="font-semibold">Hello World</div>
                  <div className="text-gray-400 text-xs">JavaScript</div>
                </button>
                <button
                  onClick={() => loadCode('javascript', 'const numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);', 'array.js')}
                  className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm text-left transition"
                >
                  <div className="font-semibold">Array Methods</div>
                  <div className="text-gray-400 text-xs">JavaScript</div>
                </button>
                <button
                  onClick={() => loadCode('python', 'numbers = [1, 2, 3]\ndoubled = [n * 2 for n in numbers]\nprint(doubled)', 'list.py')}
                  className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm text-left transition"
                >
                  <div className="font-semibold">Python Lists</div>
                  <div className="text-gray-400 text-xs">Python</div>
                </button>
                <button
                  onClick={() => loadCode('javascript', 'async function test() {\n  const res = await fetch(\'/api\');\n  return res.json();\n}', 'async.js')}
                  className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm text-left transition"
                >
                  <div className="font-semibold">Async/Await</div>
                  <div className="text-gray-400 text-xs">JavaScript</div>
                </button>
              </div>
            </div>
          )}

          {/* File Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto">
            {files.map((file: FileData) => (
              <button
                key={file.id}
                onClick={() => switchFile(file.id)}
                className={`px-4 py-2 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  file.id === currentFile?.id
                    ? 'bg-gray-700 border-b-indigo-500 text-white'
                    : 'bg-gray-800 border-b-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span>{file.name}</span>
                {hasUnsavedChanges(file.id) && <span className="text-blue-400">●</span>}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFileHandler(file.id);
                  }}
                  className="ml-1 hover:text-red-400 transition"
                  title="Delete file"
                >
                  ×
                </button>
              </button>
            ))}
          </div>

          {/* Editor Container */}
          <div className="flex-1 overflow-hidden">
            {currentFile ? (
              <EditorLayout
                key={currentFile.id}
                initialCode={currentFile.content}
                language={currentFile.language}
                onChange={(content: string) => updateFile(currentFile.id, content)}
                onSave={() => saveCode()}
                readOnly={false}
                lineHeight={20}
                style={{}}
                className=""
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                <div className="text-center">
                  <p className="text-lg mb-2">No file selected</p>
                  <p className="text-sm">Click "+ New File" to create or select a file from the tabs</p>
                </div>
              </div>
            )}
          </div>

          {/* Input/Output Section */}
          <div className="grid grid-cols-2 gap-0 border-t border-gray-700 flex-shrink-0 h-48">
            {/* Input */}
            <div className="border-r border-gray-700 flex flex-col">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                <span className="text-white font-semibold text-sm">Input (stdin)</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input here..."
                className="flex-1 bg-gray-900 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none"
              />
            </div>

            {/* Output */}
            <div className="flex flex-col">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                <span className="text-white font-semibold text-sm">Output</span>
              </div>
              <div className="flex-1 bg-gray-950 p-4 overflow-auto">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {output || 'Output will appear here...'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 overflow-y-auto flex flex-col gap-4 p-4">
          {/* File Stats */}
          <div className="bg-gray-700 rounded-lg p-3">
            <h3 className="text-white font-semibold text-sm mb-2">Files</h3>
            <p className="text-gray-400 text-xs">
              {files.length} file{files.length !== 1 ? 's' : ''}
              {hasUnsavedFiles && <span className="text-blue-400 ml-1">● Unsaved</span>}
            </p>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-gray-700 rounded-lg p-3">
            <h3 className="text-white font-semibold text-sm mb-2">⌨️ Shortcuts</h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div><span className="font-mono bg-gray-600 px-2 py-1 rounded">Ctrl+Z</span> Undo</div>
              <div><span className="font-mono bg-gray-600 px-2 py-1 rounded">Ctrl+Y</span> Redo</div>
              <div><span className="font-mono bg-gray-600 px-2 py-1 rounded">Ctrl+S</span> Save</div>
              <div><span className="font-mono bg-gray-600 px-2 py-1 rounded">Tab</span> Indent</div>
              <div><span className="font-mono bg-gray-600 px-2 py-1 rounded">Shift+Tab</span> Outdent</div>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-gray-700 rounded-lg p-3">
            <h3 className="text-white font-semibold text-sm mb-2">Languages</h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div>📜 JavaScript</div>
              <div>🐍 Python</div>
              <div>☕ Java</div>
              <div>⚙️ C++</div>
              <div>🦀 Rust</div>
            </div>
          </div>

          {/* Help */}
          <div className="bg-gray-700 rounded-lg p-3">
            <h3 className="text-white font-semibold text-sm mb-2">💡 Tips</h3>
            <div className="text-xs text-gray-300 space-y-2">
              <p>• Use Tab to indent or outdent code</p>
              <p>• Auto-complete brackets and quotes</p>
              <p>• Auto-save every 10 seconds</p>
              <p>• Split view for comparing code</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
