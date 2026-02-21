/**
 * CodeEditor Module - Main Entry Point
 * =====================================
 * 
 * Complete production-ready code editor with:
 * - 7 language syntax definitions (C, C++, Java, Python, JavaScript, HTML, CSS)
 * - Syntax highlighting with token-based rendering
 * - Auto-completion, bracket matching, auto-indent
 * - Search & replace with regex support
 * - Undo/redo with full cursor position preservation
 * - Multi-tab file management with auto-save
 * - Theme switching (dark/light)
 * - Error panel with linting support
 * - Virtual rendering for large files
 * - Performance optimized with memoization
 */

// ========================
// LANGUAGE DEFINITIONS
// ========================
export { default as languages, getLanguage, getLanguageByExtension, detectLanguage } from './languages';

// ========================
// HOOKS
// ========================
export { default as useFileManager } from './hooks/useFileManager';
export { useEditorState } from './hooks/useEditorState';
export { useLanguageDetector } from './hooks/useLanguageDetector';
export { useTokenizer } from './hooks/useTokenizer';
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
export { default as editorConfig, getTokenColor, mergeConfig } from './constants/editorConfig';

// ========================
// DEFAULT EXPORT
// ========================
export { default } from './components/EditorLayout';

