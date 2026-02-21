/**
 * useUndoRedo.js
 * ==============
 * Custom hook for undo/redo functionality
 * 
 * Features:
 * - History stack management (max 100 states)
 * - Cursor position preservation
 * - Efficient state updates
 * - Prevents adding duplicate states
 * - Debounced history updates to avoid excessive stack growth
 */

import { useState, useCallback, useRef, useEffect } from 'react';

const MAX_HISTORY_SIZE = 100;
const HISTORY_DEBOUNCE_MS = 500; // Wait 500ms before adding to history

/**
 * useUndoRedo Hook
 * 
 * @param {string} initialContent - Initial code content
 * @returns {Object} - {
 *   canUndo: boolean,
 *   canRedo: boolean,
 *   undo: function,
 *   redo: function,
 *   addToHistory: function,
 *   clearHistory: function,
 *   currentState: object
 * }
 */
export const useUndoRedo = (initialContent = '') => {
  // History stacks
  const [undoStack, setUndoStack] = useState([{
    content: initialContent,
    cursorPosition: 0,
    timestamp: Date.now()
  }]);
  
  const [redoStack, setRedoStack] = useState([]);
  
  // Track if we're in the middle of an undo/redo operation
  const isUndoRedoRef = useRef(false);
  
  // Debounce timer for history updates
  const debounceTimerRef = useRef(null);
  const pendingStateRef = useRef(null);

  /**
   * Add state to history (debounced)
   * Only adds if content actually changed
   * 
   * @param {string} content - Code content
   * @param {number} cursorPosition - Cursor position
   */
  const addToHistory = useCallback((content, cursorPosition = 0) => {
    // Don't add during undo/redo operations
    if (isUndoRedoRef.current) {
      return;
    }

    // Store pending state
    pendingStateRef.current = {
      content,
      cursorPosition,
      timestamp: Date.now()
    };

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      const newState = pendingStateRef.current;
      
      if (!newState) return;

      setUndoStack(prevStack => {
        // Don't add if content hasn't changed
        const lastState = prevStack[prevStack.length - 1];
        if (lastState && lastState.content === newState.content) {
          return prevStack;
        }

        // Add new state and limit size
        const newStack = [...prevStack, newState];
        
        // Keep only last MAX_HISTORY_SIZE items
        if (newStack.length > MAX_HISTORY_SIZE) {
          return newStack.slice(newStack.length - MAX_HISTORY_SIZE);
        }
        
        return newStack;
      });

      // Clear redo stack when new content is added
      setRedoStack([]);
      
      pendingStateRef.current = null;
    }, HISTORY_DEBOUNCE_MS);
  }, []);

  /**
   * Undo operation
   * Returns the previous state
   * 
   * @returns {Object|null} - Previous state or null if can't undo
   */
  const undo = useCallback(() => {
    if (undoStack.length <= 1) {
      return null;
    }

    isUndoRedoRef.current = true;

    const currentState = undoStack[undoStack.length - 1];
    const previousState = undoStack[undoStack.length - 2];

    // Move current state to redo stack
    setRedoStack(prevRedo => [...prevRedo, currentState]);
    
    // Remove current state from undo stack
    setUndoStack(prevUndo => prevUndo.slice(0, -1));

    // Reset flag after a tick
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 0);

    return previousState;
  }, [undoStack]);

  /**
   * Redo operation
   * Returns the next state
   * 
   * @returns {Object|null} - Next state or null if can't redo
   */
  const redo = useCallback(() => {
    if (redoStack.length === 0) {
      return null;
    }

    isUndoRedoRef.current = true;

    const nextState = redoStack[redoStack.length - 1];

    // Move state from redo to undo stack
    setUndoStack(prevUndo => [...prevUndo, nextState]);
    
    // Remove from redo stack
    setRedoStack(prevRedo => prevRedo.slice(0, -1));

    // Reset flag after a tick
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 0);

    return nextState;
  }, [redoStack]);

  /**
   * Clear all history
   * Resets to initial state
   * 
   * @param {string} content - New initial content
   * @param {number} cursorPosition - Cursor position
   */
  const clearHistory = useCallback((content = '', cursorPosition = 0) => {
    setUndoStack([{
      content,
      cursorPosition,
      timestamp: Date.now()
    }]);
    setRedoStack([]);
  }, []);

  /**
   * Get current state without popping from stack
   */
  const currentState = undoStack[undoStack.length - 1];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    // State
    currentState,
    canUndo: undoStack.length > 1,
    canRedo: redoStack.length > 0,
    
    // Actions
    undo,
    redo,
    addToHistory,
    clearHistory,
    
    // For debugging
    undoStackSize: undoStack.length,
    redoStackSize: redoStack.length
  };
};

export default useUndoRedo;
