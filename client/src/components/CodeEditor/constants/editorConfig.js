/**
 * Editor Configuration Constants
 * Default settings and configuration options
 */

export const editorConfig = {
  // Display settings
  fontSize: 14,
  fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
  lineHeight: 1.6,
  tabSize: 2,
  useSpaces: true,
  wordWrap: true,
  enableLineNumbers: true,
  enableVirtualization: true,
  virtualRenderDistance: 10, // number of lines outside viewport to render

  // Behavior settings
  autoIndent: true,
  autoCloseBrackets: true,
  autoCloseQuotes: true,
  autoSave: true,
  autoSaveInterval: 10000, // 10 seconds
  enableSmartIndent: true,

  // Syntax highlighting
  enableSyntaxHighlight: true,
  highlightActiveLine: true,
  highlightMatchingBrackets: true,
  bracketHighlightDelay: 100,

  // Search settings
  searchCaseSensitive: false,
  searchWholeWord: false,
  searchRegex: false,

  // Keyboard settings
  enableVimMode: false,
  enableEmacs: false,

  // Theme
  theme: 'dark', // 'dark' or 'light'
  backgroundColor: '#1e1e1e',
  foregroundColor: '#e8e8e8',
  lineNumberColor: '#858585',
  selectionColor: '#264f78',
  cursorColor: '#d4d4d4',

  // Colors for syntax highlighting
  colors: {
    dark: {
      keyword: '#569cd6',
      string: '#ce9178',
      comment: '#6a9955',
      number: '#b5cea8',
      operator: '#d4d4d4',
      function: '#dcdcaa',
      class: '#4ec9b0',
      builtin: '#9cdcfe',
      tag: '#569cd6',
      attribute: '#9cdcfe',
      error: '#f48771',
      warn: '#dcdcaa',
      success: '#6a9955'
    },
    light: {
      keyword: '#0000ff',
      string: '#a31515',
      comment: '#008000',
      number: '#098658',
      operator: '#000000',
      function: '#795e26',
      class: '#267f99',
      builtin: '#001080',
      tag: '#800000',
      attribute: '#ff0000',
      error: '#cd3131',
      warn: '#949494',
      success: '#007100'
    }
  },

  // Language detection
  autoDetectLanguage: true,
  defaultLanguage: 'javascript',

  // Performance
  debounceDelay: 300,
  syntaxHighlightDebounce: 500,
  maxUndoSteps: 100,

  // UI behavior
  showMinimap: false,
  showFoldGutters: true,
  showErrorIndicators: true,
  emptyLineIndicator: false,

  // Keyboard shortcuts (can be overridden)
  shortcuts: {
    save: 'Ctrl+S',
    undo: 'Ctrl+Z',
    redo: 'Ctrl+Y',
    find: 'Ctrl+F',
    replace: 'Ctrl+H',
    comment: 'Ctrl+/',
    format: 'Ctrl+Shift+F',
    deleteLine: 'Ctrl+Shift+K',
    duplicateLine: 'Ctrl+D',
    moveLineUp: 'Alt+Up',
    moveLineDown: 'Alt+Down',
    deleteWordBackward: 'Ctrl+Backspace',
    deleteWordForward: 'Ctrl+Delete'
  },

  // Linting and formatting
  enableLinting: true,
  enableFormatOnSave: false,
  formatOnSave: false,
  trimTrailingWhitespace: true,
  insertFinalNewline: true,

  // Multi-cursor
  enableMultiCursor: true,
  enableColumnSelection: true
};

// Get color for a token type
export const getTokenColor = (tokenType, theme = 'dark') => {
  const colors = editorConfig.colors[theme];
  
  const typeMap = {
    keyword: 'keyword',
    string: 'string',
    comment: 'comment',
    number: 'number',
    operator: 'operator',
    'function-name': 'function',
    'class-name': 'class',
    builtin: 'builtin',
    'tag-name': 'tag',
    'attr-name': 'attribute',
    preprocessor: 'keyword',
    decorator: 'keyword',
    annotation: 'keyword'
  };

  const color = typeMap[tokenType];
  return colors[color] || colors.operator;
};

// Merge custom config with defaults
export const mergeConfig = (customConfig) => {
  return { ...editorConfig, ...customConfig };
};

export default editorConfig;
