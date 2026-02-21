/**
 * useEditorState Hook
 * Consolidates all editor state management
 */

import { useState, useCallback, useRef } from 'react';
import { editorConfig } from '../constants/editorConfig';

export const useEditorState = (initialConfig = {}) => {
  const config = { ...editorConfig, ...initialConfig };

  // Text and content state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(config.defaultLanguage);
  const [filename, setFilename] = useState('untitled.js');

  // Editor settings state
  const [fontSize, setFontSize] = useState(config.fontSize);
  const [theme, setTheme] = useState(config.theme);
  const [tabSize, setTabSize] = useState(config.tabSize);
  const [useSpaces, setUseSpaces] = useState(config.useSpaces);
  const [wordWrap, setWordWrap] = useState(config.wordWrap);
  const [enableLineNumbers, setEnableLineNumbers] = useState(config.enableLineNumbers);

  // Features state
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [searchCaseSensitive, setSearchCaseSensitive] = useState(config.searchCaseSensitive);
  const [searchRegex, setSearchRegex] = useState(config.searchRegex);

  // UI state
  const [cursorLine, setCursorLine] = useState(0);
  const [cursorColumn, setCursorColumn] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  // Error handling state
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);

  // Undo/Redo
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);

  // Update code
  const updateCode = useCallback((newCode) => {
    setCode(newCode);
    setIsModified(true);
  }, []);

  // Save state for undo
  const saveForUndo = useCallback(() => {
    undoStackRef.current.push(code);
    if (undoStackRef.current.length > config.maxUndoSteps) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];
  }, [code, config.maxUndoSteps]);

  // Undo
  const undo = useCallback(() => {
    if (undoStackRef.current.length === 0) return;
    redoStackRef.current.push(code);
    const previousCode = undoStackRef.current.pop();
    setCode(previousCode);
  }, [code]);

  // Redo
  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0) return;
    undoStackRef.current.push(code);
    const nextCode = redoStackRef.current.pop();
    setCode(nextCode);
  }, [code]);

  // Change language
  const changeLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
  }, []);

  // Change theme
  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme);
  }, []);

  // Update cursor position
  const updateCursorPosition = useCallback((line, column) => {
    setCursorLine(line);
    setCursorColumn(column);
  }, []);

  // Set error state
  const setEditorErrors = useCallback((errorList) => {
    setErrors(errorList);
    setHasErrors(errorList.length > 0);
  }, []);

  // Clear undo/redo stacks
  const clearHistory = useCallback(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
  }, []);

  // Get editor stats
  const getStats = useCallback(() => {
    const lines = code.split('\n');
    const chars = code.length;
    const words = code.match(/\b\w+\b/g)?.length || 0;
    const nonEmptyLines = lines.filter(line => line.trim()).length;

    return {
      lines: lines.length,
      characters: chars,
      words,
      nonEmptyLines,
      cursorLine,
      cursorColumn,
      language,
      isModified
    };
  }, [code, cursorLine, cursorColumn, language, isModified]);

  // Reset editor
  const reset = useCallback(() => {
    setCode('');
    setLanguage(config.defaultLanguage);
    setFilename('untitled.js');
    setIsModified(false);
    setHasErrors(false);
    setErrors([]);
    setWarnings([]);
    setSelectedText('');
    clearHistory();
  }, [config.defaultLanguage, clearHistory]);

  return {
    // Content
    code,
    setCode: updateCode,
    language,
    setLanguage: changeLanguage,
    filename,
    setFilename,

    // Settings
    fontSize,
    setFontSize,
    theme,
    setTheme: changeTheme,
    tabSize,
    setTabSize,
    useSpaces,
    setUseSpaces,
    wordWrap,
    setWordWrap,
    enableLineNumbers,
    setEnableLineNumbers,

    // Search
    showSearch,
    setShowSearch,
    searchTerm,
    setSearchTerm,
    replaceTerm,
    setReplaceTerm,
    searchCaseSensitive,
    setSearchCaseSensitive,
    searchRegex,
    setSearchRegex,

    // UI
    cursorLine,
    cursorColumn,
    updateCursorPosition,
    selectedText,
    setSelectedText,
    isModified,
    setIsModified,

    // Errors
    errors,
    setEditorErrors,
    hasErrors,
    warnings,
    setWarnings,

    // Undo/Redo
    undo,
    redo,
    saveForUndo,
    canUndo: undoStackRef.current.length > 0,
    canRedo: redoStackRef.current.length > 0,

    // Utils
    getStats,
    reset,
    clearHistory,
    config
  };
};

export default useEditorState;
