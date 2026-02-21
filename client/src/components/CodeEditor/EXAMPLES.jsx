/**
 * Example Usage - Modular Code Editor
 * ====================================
 * 
 * This file demonstrates how to integrate the modular code editor
 * into your React application.
 */

import React, { useState } from 'react';
import EditorLayout from './components/CodeEditor';
import { useFileManager } from './components/CodeEditor';
import './components/CodeEditor/styles/styles.css';

/**
 * Example 1: Basic Editor
 * Simple code editor with onChange handler
 */
export const BasicEditorExample = () => {
  const [code, setCode] = useState(`// Welcome to the Code Editor!
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
`);

  const handleSave = (content) => {
    console.log('Saving code:', content);
    // Here you would save to backend or localStorage
    localStorage.setItem('saved-code', content);
    alert('Code saved!');
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <h2>Basic Code Editor</h2>
      <EditorLayout
        initialCode={code}
        language="javascript"
        onChange={setCode}
        onSave={handleSave}
        lineHeight={20}
      />
    </div>
  );
};

/**
 * Example 2: Editor with File Management
 * Multi-tab editor with file operations
 */
export const FileManagerEditorExample = () => {
  const {
    files,
    currentFile,
    createFile,
    updateFile,
    deleteFile,
    switchFile,
    saveFile,
    hasUnsavedChanges,
    hasUnsavedFiles,
    renameFile
  } = useFileManager();

  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    
    try {
      await createFile(
        newFileName,
        newFileName.endsWith('.py') ? 'python' : 'javascript',
        '// New file\n'
      );
      setNewFileName('');
      setIsCreating(false);
    } catch (err) {
      alert('Failed to create file: ' + err.message);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Delete this file?')) return;
    
    try {
      await deleteFile(fileId);
    } catch (err) {
      alert('Failed to delete file: ' + err.message);
    }
  };

  const handleRenameFile = async (fileId) => {
    const newName = prompt('Enter new file name:');
    if (!newName) return;
    
    try {
      await renameFile(fileId, newName);
    } catch (err) {
      alert('Failed to rename file: ' + err.message);
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ padding: '10px', margin: 0, backgroundColor: '#252526', color: '#fff' }}>
        Code Editor with File Management
        {hasUnsavedFiles && <span style={{ color: '#007acc' }}> (Unsaved Changes)</span>}
      </h2>

      {/* File Tabs */}
      <div className="file-tabs" style={{ display: 'flex', backgroundColor: '#252526' }}>
        {files.map(file => (
          <button
            key={file.id}
            className={`file-tab ${file.id === currentFile?.id ? 'active' : ''} ${hasUnsavedChanges(file.id) ? 'unsaved' : ''}`}
            onClick={() => switchFile(file.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: file.id === currentFile?.id ? '#1e1e1e' : '#2d2d2d',
              color: file.id === currentFile?.id ? '#fff' : 'rgba(255,255,255,0.6)',
              border: 'none',
              borderRight: '1px solid #333',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{file.name}</span>
            {hasUnsavedChanges(file.id) && <span style={{ color: '#007acc' }}>●</span>}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(file.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: '2px 4px',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </button>
        ))}
        
        <button
          onClick={() => setIsCreating(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2d2d2d',
            color: 'rgba(255,255,255,0.8)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          + New File
        </button>
      </div>

      {/* New File Modal */}
      {isCreating && (
        <div style={{
          padding: '10px',
          backgroundColor: '#252526',
          borderBottom: '1px solid #333',
          display: 'flex',
          gap: '8px'
        }}>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.js"
            style={{
              padding: '6px 10px',
              backgroundColor: '#3c3c3c',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              flex: 1
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
          />
          <button
            onClick={handleCreateFile}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007acc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create
          </button>
          <button
            onClick={() => setIsCreating(false)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3c3c3c',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor */}
      {currentFile ? (
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <EditorLayout
            key={currentFile.id} // Force re-mount on file switch
            initialCode={currentFile.content}
            language={currentFile.language}
            onChange={(content) => updateFile(currentFile.id, content)}
            onSave={(content) => saveFile(currentFile.id, content)}
            lineHeight={20}
          />
        </div>
      ) : (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1e1e1e',
          color: '#858585',
          fontSize: '18px'
        }}>
          No file selected. Create a new file to get started.
        </div>
      )}
    </div>
  );
};

/**
 * Example 3: Read-Only Code Viewer
 * Display code without editing
 */
export const ReadOnlyEditorExample = () => {
  const codeSnippet = `// Read-Only Code Viewer
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
`;

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h2>Read-Only Code Viewer</h2>
      <EditorLayout
        initialCode={codeSnippet}
        language="javascript"
        readOnly={true}
        lineHeight={22}
      />
    </div>
  );
};

/**
 * Example 4: Python Editor
 * Code editor for Python
 */
export const PythonEditorExample = () => {
  const [code, setCode] = useState(`# Python Code Editor
def factorial(n):
    """Calculate factorial recursively"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Test
print(factorial(5))  # 120
`);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h2>Python Code Editor</h2>
      <EditorLayout
        initialCode={code}
        language="python"
        onChange={setCode}
        onSave={(content) => console.log('Python saved:', content)}
        lineHeight={20}
      />
    </div>
  );
};

/**
 * Example 5: Custom Styled Editor
 * Editor with custom theme
 */
export const CustomStyledEditorExample = () => {
  const [code, setCode] = useState('// Custom styled editor\nconst x = 42;');

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h2>Custom Styled Editor</h2>
      <div style={{
        '--editor-bg': '#2b2b2b',
        '--editor-text': '#f0f0f0',
        '--syntax-keyword': '#ff79c6',
        '--syntax-string': '#f1fa8c',
        '--syntax-comment': '#6272a4',
        height: '100%'
      }}>
        <EditorLayout
          initialCode={code}
          language="javascript"
          onChange={setCode}
          lineHeight={22}
        />
      </div>
    </div>
  );
};

// Export all examples
export default {
  BasicEditorExample,
  FileManagerEditorExample,
  ReadOnlyEditorExample,
  PythonEditorExample,
  CustomStyledEditorExample
};
