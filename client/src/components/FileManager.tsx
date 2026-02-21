import React, { useState, useEffect, useCallback } from 'react';
import './FileManager.css';

export interface FileData {
  id: string;
  filename: string;
  content: string;
  language: string;
  isDirty: boolean;
  lastSaved?: Date;
}

interface FileManagerProps {
  onFileChange: (file: FileData | null) => void;
  onFilesUpdate: (files: FileData[]) => void;
  currentFile: FileData | null;
  autoSaveInterval?: number; // in milliseconds, default 10000 (10 seconds)
}

const FileManager: React.FC<FileManagerProps> = ({
  onFileChange,
  onFilesUpdate,
  currentFile,
  autoSaveInterval = 10000
}) => {
  const [files, setFiles] = useState<FileData[]>([
    {
      id: '1',
      filename: 'untitled.js',
      content: '// Write your code here\n',
      language: 'javascript',
      isDirty: false
    }
  ]);
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [newFilename, setNewFilename] = useState('');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Get active file
  const activeFile = files.find(f => f.id === activeFileId) || null;

  // Update parent component when active file changes
  useEffect(() => {
    if (activeFile) {
      onFileChange(activeFile);
    }
  }, [activeFile, onFileChange]);

  // Update parent component when files list changes
  useEffect(() => {
    onFilesUpdate(files);
  }, [files, onFilesUpdate]);

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      files.forEach(file => {
        if (file.isDirty) {
          saveFileToBackend(file);
        }
      });
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [files, autoSaveInterval]);

  // Save file to backend
  const saveFileToBackend = async (file: FileData) => {
    setLoadingStates(prev => ({ ...prev, [file.id]: true }));
    
    try {
      const response = await fetch('http://localhost:3001/api/files/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.filename,
          content: file.content,
          language: file.language
        }),
      });

      if (response.ok) {
        // Mark file as saved
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, isDirty: false, lastSaved: new Date() }
            : f
        ));
      } else {
        console.error('Failed to save file:', await response.text());
      }
    } catch (error) {
      console.error('Error saving file:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [file.id]: false }));
    }
  };

  // Load file from backend
  const loadFileFromBackend = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/files/load?filename=${encodeURIComponent(filename)}`,
      
      if (response.ok) {
        const data = await response.json();
        const newFile: FileData = {
          id: Date.now().toString(),
          filename: data.filename,
          content: data.content,
          language: data.language || 'javascript',
          isDirty: false,
          lastSaved: new Date(data.lastModified)
        };

        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
      } else {
        alert('Failed to load file');
      }
    } catch (error) {
      console.error('Error loading file:', error);
      alert('Error loading file');
    }
  };

  // Delete file from backend
  const deleteFileFromBackend = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/files/delete?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Failed to delete file from backend');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  // Rename file on backend
  const renameFileOnBackend = async (oldFilename: string, newFilename: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/files/rename', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldFilename, newFilename }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error renaming file:', error);
      return false;
    }
  };

  // Create new file
  const createNewFile = () => {
    if (!newFilename.trim()) {
      alert('Please enter a filename');
      return;
    }

    // Determine language from extension
    const extension = newFilename.split('.').pop()?.toLowerCase() || 'txt';
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'css': 'css',
      'json': 'json'
    };

    const language = languageMap[extension] || 'javascript';

    const newFile: FileData = {
      id: Date.now().toString(),
      filename: newFilename,
      content: '',
      language,
      isDirty: true
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setShowNewFileDialog(false);
    setNewFilename('');
  };

  // Close file
  const closeFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    
    if (file && file.isDirty) {
      if (!window.confirm(`${file.filename} has unsaved changes. Close anyway?`)) {
        return;
      }
    }

    const newFiles = files.filter(f => f.id !== fileId);
    
    if (newFiles.length === 0) {
      // Create a new untitled file
      const untitledFile: FileData = {
        id: Date.now().toString(),
        filename: 'untitled.js',
        content: '',
        language: 'javascript',
        isDirty: false
      };
      setFiles([untitledFile]);
      setActiveFileId(untitledFile.id);
    } else {
      setFiles(newFiles);
      if (activeFileId === fileId) {
        setActiveFileId(newFiles[newFiles.length - 1].id);
      }
    }
  };

  // Delete file
  const deleteFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    if (!window.confirm(`Are you sure you want to delete ${file.filename}?`)) {
      return;
    }

    deleteFileFromBackend(file.filename);
    closeFile(fileId);
  };

  // Rename file
  const renameFile = async () => {
    if (!newFilename.trim() || !renameFileId) {
      return;
    }

    const file = files.find(f => f.id === renameFileId);
    if (!file) return;

    const success = await renameFileOnBackend(file.filename, newFilename);
    
    if (success) {
      setFiles(prev => prev.map(f => 
        f.id === renameFileId 
          ? { ...f, filename: newFilename }
          : f
      ));
    } else {
      alert('Failed to rename file');
    }

    setShowRenameDialog(false);
    setRenameFileId(null);
    setNewFilename('');
  };

  // Update file content
  const updateFileContent = useCallback((fileId: string, content: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, content, isDirty: true }
        : f
    ));
  }, []);

  // Manually save file
  const handleSaveFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      saveFileToBackend(file);
    }
  };

  return (
    <div className="file-manager">
      {/* Tabs */}
      <div className="file-tabs">
        <div className="tabs-container">
          {files.map(file => (
            <div
              key={file.id}
              className={`file-tab ${activeFileId === file.id ? 'active' : ''}`}
              onClick={() => setActiveFileId(file.id)}
            >
              <span className="tab-filename">
                {file.filename}
                {file.isDirty && <span className="dirty-indicator">●</span>}
                {loadingStates[file.id] && <span className="saving-indicator">💾</span>}
              </span>
              <div className="tab-actions">
                <button
                  className="tab-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveFile(file.id);
                  }}
                  title="Save file (Ctrl+S)"
                >
                  💾
                </button>
                <button
                  className="tab-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenameFileId(file.id);
                    setNewFilename(file.filename);
                    setShowRenameDialog(true);
                  }}
                  title="Rename file"
                >
                  ✏️
                </button>
                <button
                  className="tab-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                  }}
                  title="Delete file"
                >
                  🗑️
                </button>
                <button
                  className="tab-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file.id);
                  }}
                  title="Close file"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button
          className="new-tab-btn"
          onClick={() => setShowNewFileDialog(true)}
          title="New file"
        >
          +
        </button>
      </div>

      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="dialog-overlay" onClick={() => setShowNewFileDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Create New File</h3>
            <input
              type="text"
              placeholder="filename.js"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  createNewFile();
                } else if (e.key === 'Escape') {
                  setShowNewFileDialog(false);
                  setNewFilename('');
                }
              }}
              autoFocus
            />
            <div className="dialog-actions">
              <button onClick={createNewFile}>Create</button>
              <button onClick={() => {
                setShowNewFileDialog(false);
                setNewFilename('');
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Rename File Dialog */}
      {showRenameDialog && (
        <div className="dialog-overlay" onClick={() => setShowRenameDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Rename File</h3>
            <input
              type="text"
              placeholder="filename.js"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  renameFile();
                } else if (e.key === 'Escape') {
                  setShowRenameDialog(false);
                  setRenameFileId(null);
                  setNewFilename('');
                }
              }}
              autoFocus
            />
            <div className="dialog-actions">
              <button onClick={renameFile}>Rename</button>
              <button onClick={() => {
                setShowRenameDialog(false);
                setRenameFileId(null);
                setNewFilename('');
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
export { updateFileContent };

// Export the updateFileContent function for use by parent components
function updateFileContent(this: any, fileId: string, content: string) {
  // This is just a type export, actual implementation is in the component
}
