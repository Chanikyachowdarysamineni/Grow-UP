/**
 * CodeEditor Module - Main Entry Point (TypeScript)
 * Complete production-ready code editor with all features
 */

// ========================
// TYPES & INTERFACES
// ========================
export type {
  FileData,
  FileManagerState,
  FileManagerActions,
  UseFileManager
} from './hooks/useFileManager';

// ========================
// LANGUAGE DEFINITIONS
// ========================
export { languages, getLanguage, getLanguageByExtension, detectLanguage } from './languages';

// ========================
// HOOKS
// ========================
// File Management
export { useFileManager } from './hooks/useFileManager';

// Editor State
export { useEditorState } from './hooks/useEditorState';

// Language Detection
export { useLanguageDetector } from './hooks/useLanguageDetector';

// Tokenization & Syntax Highlighting
export { useTokenizer } from './hooks/useTokenizer';

// Editing Features
export { useUndoRedo } from './hooks/useUndoRedo';
export { useAutoComplete } from './hooks/useAutoComplete';

// ========================
// COMPONENTS
// ========================
// Core Editor
export { default as EditorLayout } from './components/EditorLayout';
export { default as LineNumbers } from './components/LineNumbers';
export { default as TextAreaEditor } from './components/TextAreaEditor';

// UI Components
export { default as LanguageSelector } from './components/LanguageSelector';
export { default as ErrorPanel } from './components/ErrorPanel';
export { default as ThemeSwitcher } from './components/ThemeSwitcher';
export { default as SearchPanel } from './components/SearchPanel';

// ========================
// UTILITIES
// ========================
// Syntax Highlighting
export {
  highlightCode,
  highlightCodeCached,
  clearHighlightCache,
  getLineCount,
  getCursorPosition
} from './utils/SyntaxHighlighter';

// Bracket Matching
export { bracketMatcher } from './utils/bracketMatcher';

// Code Formatting
export { formatter } from './utils/formatter';

// Search & Replace
export { searchUtils } from './utils/searchUtils';

// Keyboard Handling
export { keyboardHandler } from './utils/keyboardHandler';

// ========================
// CONFIGURATION
// ========================
export { editorConfig, getTokenColor, mergeConfig } from './constants/editorConfig';

// ========================
// DEFAULT EXPORT
// ========================
export { default } from './components/EditorLayout';

