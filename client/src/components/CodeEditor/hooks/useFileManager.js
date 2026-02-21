/**
 * useFileManager.js
 * =================
 * Custom hook for file management operations
 * 
 * Features:
 * - Multi-tab file management
 * - Auto-save every 10 seconds
 * - File CRUD operations (create, read, update, delete)
 * - Backend API integration
 * - Unsaved changes tracking
 */

import { useState, useCallback, useEffect, useRef } from 'react';

// API base URL - Code Execution Server (port 3001)
const API_BASE = 'http://localhost:3001/api';

// Auto-save interval (10 seconds)
const AUTO_SAVE_INTERVAL = 10000;

/**
 * useFileManager Hook
 * 
 * @returns {Object} - File management state and functions
 * @typedef {import('./useFileManager.d').UseFileManager} UseFileManager
 * @returns {UseFileManager}
 */
export const useFileManager = () => {
  const [files, setFiles] = useState([]);
  const [currentFileId, setCurrentFileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(new Set());
  
  // Refs for auto-save
  const autoSaveTimerRef = useRef(null);
  const filesRef = useRef(files);
  const unsavedChangesRef = useRef(unsavedChanges);

  // Keep refs in sync
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    unsavedChangesRef.current = unsavedChanges;
  }, [unsavedChanges]);

  /**
   * Fetch all files from backend
   */
  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/files`);
      if (!response.ok) throw new Error('Failed to load files');
      
      const data = await response.json();
      setFiles(data);
      
      // If no current file, select the first one
      if (!currentFileId && data.length > 0) {
        setCurrentFileId(data[0].id);
      }
    } catch (err) {
      setError(err.message);
      console.error('Load files error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFileId]);

  /**
   * Create a new file
   * 
   * @param {string} name - File name
   * @param {string} language - Programming language
   * @param {string} content - Initial content
   * @returns {Promise<Object>} - Created file object
   */
  const createFile = useCallback(async (name, language = 'javascript', content = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, language, content })
      });
      
      if (!response.ok) throw new Error('Failed to create file');
      
      const newFile = await response.json();
      setFiles(prev => [...prev, newFile]);
      setCurrentFileId(newFile.id);
      
      return newFile;
    } catch (err) {
      setError(err.message);
      console.error('Create file error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update file content
   * 
   * @param {string} fileId - File ID
   * @param {string} content - New content
   * @param {boolean} persist - Whether to persist to backend immediately
   */
  const updateFile = useCallback(async (fileId, content, persist = false) => {
    // Update local state
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, content } : file
    ));

    // Mark as having unsaved changes
    setUnsavedChanges(prev => new Set(prev).add(fileId));

    // Persist immediately if requested
    if (persist) {
      await saveFile(fileId, content);
    }
  }, []);

  /**
   * Save file to backend
   * 
   * @param {string} fileId - File ID
   * @param {string} content - Content to save
   */
  const saveFile = useCallback(async (fileId, content) => {
    try {
      const response = await fetch(`${API_BASE}/files/${fileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) throw new Error('Failed to save file');
      
      // Mark as saved
      setUnsavedChanges(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    } catch (err) {
      setError(err.message);
      console.error('Save file error:', err);
      throw err;
    }
  }, []);

  /**
   * Delete a file
   * 
   * @param {string} fileId - File ID to delete
   */
  const deleteFile = useCallback(async (fileId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/files/${fileId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete file');
      
      setFiles(prev => {
        const filtered = prev.filter(file => file.id !== fileId);
        
        // If deleted current file, switch to another
        if (fileId === currentFileId) {
          const newCurrentFile = filtered.length > 0 ? filtered[0].id : null;
          setCurrentFileId(newCurrentFile);
        }
        
        return filtered;
      });

      // Remove from unsaved changes
      setUnsavedChanges(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    } catch (err) {
      setError(err.message);
      console.error('Delete file error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentFileId]);

  /**
   * Rename a file
   * 
   * @param {string} fileId - File ID
   * @param {string} newName - New file name
   */
  const renameFile = useCallback(async (fileId, newName) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/files/${fileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      
      if (!response.ok) throw new Error('Failed to rename file');
      
      const updatedFile = await response.json();
      setFiles(prev => prev.map(file => 
        file.id === fileId ? updatedFile : file
      ));
    } catch (err) {
      setError(err.message);
      console.error('Rename file error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Switch to a different file
   * 
   * @param {string} fileId - File ID to switch to
   */
  const switchFile = useCallback((fileId) => {
    setCurrentFileId(fileId);
  }, []);

  /**
   * Get current active file
   * 
   * @returns {Object|null} - Current file object
   */
  const getCurrentFile = useCallback(() => {
    return files.find(file => file.id === currentFileId) || null;
  }, [files, currentFileId]);

  /**
   * Check if file has unsaved changes
   * 
   * @param {string} fileId - File ID
   * @returns {boolean}
   */
  const hasUnsavedChanges = useCallback((fileId) => {
    return unsavedChanges.has(fileId);
  }, [unsavedChanges]);

  /**
   * Auto-save all files with unsaved changes
   */
  const autoSaveAll = useCallback(async () => {
    const filesToSave = Array.from(unsavedChangesRef.current);
    
    if (filesToSave.length === 0) return;

    console.log(`Auto-saving ${filesToSave.length} file(s)...`);

    for (const fileId of filesToSave) {
      const file = filesRef.current.find(f => f.id === fileId);
      if (file) {
        try {
          await saveFile(fileId, file.content);
        } catch (err) {
          console.error(`Auto-save failed for file ${fileId}:`, err);
        }
      }
    }
  }, [saveFile]);

  /**
   * Save all files manually
   */
  const saveAll = useCallback(async () => {
    await autoSaveAll();
  }, [autoSaveAll]);

  // Auto-save effect
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    // Start new auto-save timer
    autoSaveTimerRef.current = setInterval(() => {
      autoSaveAll();
    }, AUTO_SAVE_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
      
      // Final save on unmount
      autoSaveAll();
    };
  }, [autoSaveAll]);

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return {
    // State
    files,
    currentFileId,
    loading,
    error,
    
    // File operations
    createFile,
    updateFile,
    saveFile,
    deleteFile,
    renameFile,
    switchFile,
    loadFiles,
    saveAll,
    
    // Helpers
    getCurrentFile,
    hasUnsavedChanges,
    
    // Computed
    currentFile: getCurrentFile(),
    hasUnsavedFiles: unsavedChanges.size > 0
  };
};

export default useFileManager;
