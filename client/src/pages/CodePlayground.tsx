import React, { useState, useRef } from 'react';
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
  category: string;
}

interface CodeTemplate {
  name: string;
  icon: string;
  ext: string;
  template: string;
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
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const outputRef = useRef<HTMLDivElement>(null);

  const codeExamples: CodeExample[] = [
    // JavaScript Examples
    {
      id: '1',
      title: 'Hello World',
      language: 'javascript',
      code: 'console.log("Hello, World!");',
      description: 'Your first program',
      category: 'Basics'
    },
    {
      id: '2',
      title: 'Variables & Types',
      language: 'javascript',
      code: `const name = "Developer";
const age = 25;
const isActive = true;
console.log(\`\${name} (\${age})\`)`,
      description: 'Working with variables',
      category: 'Basics'
    },
    {
      id: '3',
      title: 'Array Methods',
      language: 'javascript',
      code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Doubled:", doubled);
console.log("Sum:", sum);`,
      description: 'Array map and reduce',
      category: 'Arrays'
    },
    {
      id: '4',
      title: 'Object Operations',
      language: 'javascript',
      code: `const user = { name: "John", age: 30, city: "NYC" };
console.log(JSON.stringify(user, null, 2));`,
      description: 'Working with objects',
      category: 'Objects'
    },
    {
      id: '5',
      title: 'Async/Await Pattern',
      language: 'javascript',
      code: `async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
fetchData();`,
      description: 'Async programming',
      category: 'Advanced'
    },
    {
      id: '6',
      title: 'ES6 Destructuring',
      language: 'javascript',
      code: `const [a, b, ...rest] = [1, 2, 3, 4, 5];
const { x, y } = { x: 10, y: 20 };
console.log(a, b, rest);
console.log(x, y);`,
      description: 'Destructuring assignment',
      category: 'Advanced'
    },
    // Python Examples
    {
      id: '7',
      title: 'Python Hello World',
      language: 'python',
      code: 'print("Hello, Python!")',
      description: 'Start with Python',
      category: 'Basics'
    },
    {
      id: '8',
      title: 'List Comprehension',
      language: 'python',
      code: `numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(squared)`,
      description: 'Python lists',
      category: 'Collections'
    },
    {
      id: '9',
      title: 'Functions',
      language: 'python',
      code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)

print(f"5! = {factorial(5)}")`,
      description: 'Function definition',
      category: 'Functions'
    }
  ];

  const templates: CodeTemplate[] = [
    { name: 'JavaScript', icon: '📜', ext: '.js', template: '// Start coding...\nconsole.log("Hello, World!");' },
    { name: 'Python', icon: '🐍', ext: '.py', template: '# Start coding...\nprint("Hello, World!")' },
    { name: 'Java', icon: '☕', ext: '.java', template: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}' },
    { name: 'C++', icon: '⚙️', ext: '.cpp', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!\\n";\n  return 0;\n}' },
    { name: 'Go', icon: '🔷', ext: '.go', template: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, World!")\n}' },
    { name: 'Rust', icon: '🦀', ext: '.rs', template: 'fn main() {\n  println!("Hello, World!");\n}' }
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

  const loadCode = async (code: string, title: string, language: string) => {
    try {
      await createFile(title, language, code);
      setShowExamples(false);
    } catch (err) {
      alert('Failed to create file: ' + err);
    }
  };

  const createNewFile = async (language: string = 'javascript') => {
    const template = templates.find(t => t.name.toLowerCase() === language.toLowerCase());
    const ext = template?.ext || '.js';
    const tmpl = template?.template || '';
    const name = prompt(`Enter file name (${ext}):`, `untitled${ext}`);
    if (!name) return;
    
    try {
      await createFile(name, language, tmpl);
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

  const clearOutput = () => {
    setOutput('');
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert('Output copied to clipboard!');
  };

  const downloadFile = () => {
    if (!currentFile) return;
    const element = document.createElement('a');
    const file = new Blob([currentFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = currentFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const categories = Array.from(new Set(codeExamples.map(ex => ex.category)));

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Files & Templates */}
        <div className={`w-80 border-r ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} overflow-y-auto flex flex-col`}>
          {/* Create File Section */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className="font-bold text-lg mb-3">📂 Files</h2>
            <button
              onClick={() => createNewFile('javascript')}
              className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition mb-2 ${
                theme === 'dark'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              + New File
            </button>
          </div>

          {/* Open Files */}
          {files.length > 0 && (
            <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`px-4 py-3 font-semibold text-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                Open ({files.length})
              </div>
              <div className="divide-y" style={{ divideColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}>
                {files.map((file: FileData) => (
                  <button
                    key={file.id}
                    onClick={() => switchFile(file.id)}
                    className={`w-full text-left px-4 py-2 transition flex items-center justify-between group ${
                      file.id === currentFile?.id
                        ? theme === 'dark'
                          ? 'bg-indigo-900 text-indigo-200'
                          : 'bg-indigo-100 text-indigo-900'
                        : theme === 'dark'
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-xs opacity-50">{file.language}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasUnsavedChanges(file.id) && (
                        <span className="text-blue-400 text-lg">●</span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFileHandler(file.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-300"
                        title="Delete file"
                      >
                        ✕
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Templates */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className="font-semibold text-sm mb-3">🚀 Quick Start</h3>
            <div className="grid grid-cols-3 gap-2">
              {templates.map((template) => (
                <button
                  key={template.name}
                  onClick={() => createNewFile(template.name.toLowerCase())}
                  className={`p-3 rounded-lg text-center transition text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                  title={`Create ${template.name} file`}
                >
                  <div className="text-lg mb-1">{template.icon}</div>
                  <div className="text-xs">{template.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className="font-semibold text-sm mb-2">📊 Statistics</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Total Files:</span>
                <span className="font-mono font-bold">{files.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Lines of Code:</span>
                <span className="font-mono font-bold">
                  {files.reduce((sum, f: FileData) => sum + f.content.split('\n').length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Unsaved:</span>
                <span className="font-mono font-bold text-blue-400">
                  {files.filter((f: FileData) => hasUnsavedChanges(f.id)).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className={`border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-lg hidden lg:block">Code Playground</h1>
              {currentFile && (
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>📄 {currentFile.name}</span>
                  {hasUnsavedChanges(currentFile.id) && (
                    <span className="text-blue-400 ml-2">● Unsaved</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowExamples(!showExamples)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  showExamples
                    ? theme === 'dark'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                📚 Examples
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  showSettings
                    ? theme === 'dark'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                ⚙️ Settings
              </button>

              <button
                onClick={saveCode}
                disabled={!currentFile || !hasUnsavedFiles}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  currentFile && hasUnsavedFiles
                    ? theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                💾 Save
              </button>

              <button
                onClick={runCode}
                disabled={!currentFile || isRunning}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${
                  currentFile && !isRunning
                    ? theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {isRunning ? '⏳ Running...' : '▶️ Run'}
              </button>
            </div>
          </div>

          {/* Examples Panel */}
          {showExamples && (
            <div className={`border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 max-h-64 overflow-y-auto`}>
              <h3 className="font-semibold mb-3">Code Examples</h3>
              {categories.map((category) => (
                <div key={category} className="mb-4">
                  <h4 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    📌 {category}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {codeExamples
                      .filter(ex => ex.category === category)
                      .map((example) => (
                        <button
                          key={example.id}
                          onClick={() => loadCode(example.code, example.title, example.language)}
                          className={`p-3 rounded-lg text-left transition text-xs ${
                            theme === 'dark'
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                          }`}
                          title={example.description}
                        >
                          <div className="font-semibold truncate">{example.title}</div>
                          <div className="opacity-50 text-xs">{example.language}</div>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className={`border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4`}>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Font Size</label>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs opacity-50">{fontSize}px</span>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* File Tabs */}
          {files.length > 0 && (
            <div className={`border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex overflow-x-auto`}>
              {files.map((file: FileData) => (
                <button
                  key={file.id}
                  onClick={() => switchFile(file.id)}
                  className={`px-4 py-2 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                    file.id === currentFile?.id
                      ? theme === 'dark'
                        ? 'bg-gray-700 border-b-indigo-500 text-white'
                        : 'bg-gray-100 border-b-indigo-500 text-gray-900'
                      : theme === 'dark'
                      ? 'border-b-transparent text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'border-b-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
          )}

          {/* Editor */}
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
                style={{ fontSize: `${fontSize}px` }}
                className=""
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-lg font-semibold mb-2">No File Selected</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create a new file from the left sidebar to start coding
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input/Output Section */}
          <div className={`grid grid-cols-2 gap-0 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0 h-56`}>
            {/* Input */}
            <div className={`flex flex-col border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`px-4 py-2 border-b font-semibold text-sm flex items-center justify-between ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-100 border-gray-200'
              }`}>
                <span>⌨️ Input (stdin)</span>
                <button
                  onClick={() => setInput('')}
                  className="text-xs opacity-50 hover:opacity-100 transition"
                  title="Clear input"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input here or leave empty..."
                className={`flex-1 p-4 font-mono text-sm focus:outline-none resize-none ${
                  theme === 'dark'
                    ? 'bg-gray-900 text-gray-300'
                    : 'bg-white text-gray-900'
                }`}
                style={{ fontSize: `${fontSize - 2}px` }}
              />
            </div>

            {/* Output */}
            <div className="flex flex-col">
              <div className={`px-4 py-2 border-b font-semibold text-sm flex items-center justify-between ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-100 border-gray-200'
              }`}>
                <span>📤 Output</span>
                <div className="flex gap-2">
                  <button
                    onClick={copyOutput}
                    className="text-xs opacity-50 hover:opacity-100 transition"
                    title="Copy output"
                  >
                    📋
                  </button>
                  <button
                    onClick={clearOutput}
                    className="text-xs opacity-50 hover:opacity-100 transition"
                    title="Clear output"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div
                ref={outputRef}
                className={`flex-1 p-4 overflow-auto ${
                  theme === 'dark'
                    ? 'bg-gray-950 text-green-400'
                    : 'bg-gray-50 text-green-700'
                }`}
              >
                <pre className="font-mono text-sm whitespace-pre-wrap break-words">
                  {output || '✨ Output will appear here...'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Help & Shortcuts */}
        <div className={`w-72 border-l ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} overflow-y-auto p-4 space-y-4 hidden lg:block`}>
          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="font-semibold mb-3">⌨️ Keyboard Shortcuts</h3>
            <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <div><span className={`font-mono px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>Ctrl+S</span> Save</div>
              <div><span className={`font-mono px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>Ctrl+Z</span> Undo</div>
              <div><span className={`font-mono px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>Ctrl+Y</span> Redo</div>
              <div><span className={`font-mono px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>Tab</span> Indent</div>
              <div><span className={`font-mono px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>Shift+Tab</span> Outdent</div>
            </div>
          </div>

          {/* Supported Languages */}
          <div>
            <h3 className="font-semibold mb-3">🗣️ Languages</h3>
            <div className={`space-y-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <div>📜 JavaScript (ES6+)</div>
              <div>🐍 Python (3.x)</div>
              <div>☕ Java (11+)</div>
              <div>⚙️ C++ (Modern)</div>
              <div>🔷 Go</div>
              <div>🦀 Rust</div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3">✨ Features</h3>
            <div className={`space-y-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <div>✅ Multi-file editing</div>
              <div>✅ Syntax highlighting</div>
              <div>✅ Live code execution</div>
              <div>✅ Input/Output console</div>
              <div>✅ Code templates</div>
              <div>✅ Examples & snippets</div>
            </div>
          </div>

          {/* Tips */}
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-2">💡 Tips</h3>
            <div className={`text-xs space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>• Use keyboard shortcuts for faster editing</p>
              <p>• Copy examples to quickly test patterns</p>
              <p>• See output in real-time</p>
              <p>• Save files to your browser locally</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
