import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import './CustomCodeEditor.css';

interface CustomCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  onSave?: () => void;
  filename?: string;
  onFormat?: () => void;
}

interface CursorPosition {
  line: number;
  column: number;
}

interface HistoryState {
  content: string;
  cursorPosition: number;
}

interface SearchState {
  query: string;
  replaceWith: string;
  caseSensitive: boolean;
  currentMatch: number;
  totalMatches: number;
}

interface LintError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

const CustomCodeEditor: React.FC<CustomCodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  theme = 'dark',
  readOnly = false,
  onSave,
  filename = 'untitled.js',
  onFormat
}) => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });
  const [scrollTop, setScrollTop] = useState(0);
  const [wordWrap, setWordWrap] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showSearch, setShowSearch] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [lintErrors, setLintErrors] = useState<LintError[]>([]);
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    replaceWith: '',
    caseSensitive: false,
    currentMatch: 0,
    totalMatches: 0
  });
  
  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState<HistoryState[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryState[]>([]);
  const [isUndoRedo, setIsUndoRedo] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get lines from value
  const lines = value.split('\n');
  const lineCount = lines.length;

  // Update cursor position
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const updateCursorPosition = () => {
      const selectionStart = textarea.selectionStart;
      const textBeforeCursor = value.substring(0, selectionStart);
      const lineNumber = textBeforeCursor.split('\n').length;
      const lastLineBreak = textBeforeCursor.lastIndexOf('\n');
      const column = selectionStart - lastLineBreak;

      setCursorPosition({ line: lineNumber, column });
    };

    textarea.addEventListener('click', updateCursorPosition);
    textarea.addEventListener('keyup', updateCursorPosition);

    return () => {
      textarea.removeEventListener('click', updateCursorPosition);
      textarea.removeEventListener('keyup', updateCursorPosition);
    };
  }, [value]);

  // Undo/Redo history management
  useEffect(() => {
    if (isUndoRedo) {
      setIsUndoRedo(false);
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const newState: HistoryState = {
      content: value,
      cursorPosition: textarea.selectionStart
    };

    setUndoStack(prev => {
      const newStack = [...prev, newState];
      // Keep only last 100 states
      return newStack.slice(-100);
    });
    setRedoStack([]);
  }, [value, isUndoRedo]);

  // Search functionality
  useEffect(() => {
    if (!searchState.query) {
      setSearchState(prev => ({ ...prev, totalMatches: 0, currentMatch: 0 }));
      return;
    }

    const flags = searchState.caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(searchState.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const matches = value.match(regex);
    const totalMatches = matches ? matches.length : 0;

    setSearchState(prev => ({
      ...prev,
      totalMatches,
      currentMatch: totalMatches > 0 ? Math.min(prev.currentMatch, totalMatches) : 0
    }));
  }, [searchState.query, searchState.caseSensitive, value]);

  // Undo function
  const handleUndo = () => {
    if (undoStack.length <= 1) return;

    const currentState = undoStack[undoStack.length - 1];
    const previousState = undoStack[undoStack.length - 2];

    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(prev => prev.slice(0, -1));
    setIsUndoRedo(true);
    onChange(previousState.content);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = previousState.cursorPosition;
        textareaRef.current.selectionEnd = previousState.cursorPosition;
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Redo function
  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];

    setUndoStack(prev => [...prev, nextState]);
    setRedoStack(prev => prev.slice(0, -1));
    setIsUndoRedo(true);
    onChange(nextState.content);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = nextState.cursorPosition;
        textareaRef.current.selectionEnd = nextState.cursorPosition;
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Font size controls
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 8));
  };

  const resetFontSize = () => {
    setFontSize(14);
  };

  // Search functions
  const findNext = () => {
    if (!searchState.query || searchState.totalMatches === 0) return;

    const nextMatch = searchState.currentMatch >= searchState.totalMatches ? 1 : searchState.currentMatch + 1;
    setSearchState(prev => ({ ...prev, currentMatch: nextMatch }));

    const flags = searchState.caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(searchState.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    let count = 0;
    let match;
    
    while ((match = regex.exec(value)) !== null) {
      count++;
      if (count === nextMatch) {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = match.index;
          textareaRef.current.selectionEnd = match.index + match[0].length;
          textareaRef.current.focus();
        }
        break;
      }
    }
  };

  const findPrevious = () => {
    if (!searchState.query || searchState.totalMatches === 0) return;

    const prevMatch = searchState.currentMatch <= 1 ? searchState.totalMatches : searchState.currentMatch - 1;
    setSearchState(prev => ({ ...prev, currentMatch: prevMatch }));

    const flags = searchState.caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(searchState.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    let count = 0;
    let match;
    
    while ((match = regex.exec(value)) !== null) {
      count++;
      if (count === prevMatch) {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = match.index;
          textareaRef.current.selectionEnd = match.index + match[0].length;
          textareaRef.current.focus();
        }
        break;
      }
    }
  };

  const replaceNext = () => {
    if (!searchState.query || searchState.totalMatches === 0) return;

    const flags = searchState.caseSensitive ? '' : 'i';
    const regex = new RegExp(searchState.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    
    const newValue = value.replace(regex, searchState.replaceWith);
    onChange(newValue);
    
    setTimeout(() => findNext(), 0);
  };

  const replaceAll = () => {
    if (!searchState.query) return;

    const flags = searchState.caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(searchState.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    
    const newValue = value.replace(regex, searchState.replaceWith);
    onChange(newValue);
    
    setSearchState(prev => ({ ...prev, currentMatch: 0, totalMatches: 0 }));
  };

  // Synchronize scroll between line numbers and editor
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
    }
  };

  // Handle tab key
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+S: Save
      if (e.key === 's') {
        e.preventDefault();
        onSave?.();
        return;
      }

      // Ctrl+Z: Undo
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z: Redo
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Ctrl+F: Find
      if (e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
        setShowReplace(false);
        setTimeout(() => searchInputRef.current?.focus(), 0);
        return;
      }

      // Ctrl+H: Replace
      if (e.key === 'h') {
        e.preventDefault();
        setShowSearch(true);
        setShowReplace(true);
        setTimeout(() => searchInputRef.current?.focus(), 0);
        return;
      }

      // Ctrl+G: Find Next
      if (e.key === 'g') {
        e.preventDefault();
        findNext();
        return;
      }

      // Ctrl+Plus: Increase font size
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        increaseFontSize();
        return;
      }

      // Ctrl+Minus: Decrease font size
      if (e.key === '-') {
        e.preventDefault();
        decreaseFontSize();
        return;
      }

      // Ctrl+0: Reset font size
      if (e.key === '0') {
        e.preventDefault();
        resetFontSize();
        return;
      }

      // Ctrl+D: Duplicate line
      if (e.key === 'd') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBeforeStart = value.substring(0, start);
        const textAfterEnd = value.substring(end);
        const lastLineBreak = textBeforeStart.lastIndexOf('\n');
        const nextLineBreak = value.indexOf('\n', end);
        
        const lineStart = lastLineBreak + 1;
        const lineEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
        const currentLine = value.substring(lineStart, lineEnd);
        
        const newValue = 
          value.substring(0, lineEnd) + 
          '\n' + 
          currentLine + 
          value.substring(lineEnd);
        
        onChange(newValue);
        return;
      }
    }

    // Alt+Shift+F: Format code
    if (e.altKey && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      formatCode();
      return;
    }

    // Tab key handling
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (start === end) {
        // No selection - insert spaces
        const spaces = '  '; // 2 spaces

        const newValue = value.substring(0, start) + spaces + value.substring(end);
        onChange(newValue);

        // Set cursor position after the inserted spaces
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
        }, 0);
      } else {
        // Selection exists - indent/outdent multiple lines
        if (e.shiftKey) {
          // Shift+Tab: Outdent
          const textBeforeStart = value.substring(0, start);
          const textAfterEnd = value.substring(end);
          const firstLineStart = textBeforeStart.lastIndexOf('\n') + 1;
          const lastLineEnd = value.indexOf('\n', end);
          const selectedText = value.substring(firstLineStart, lastLineEnd === -1 ? value.length : lastLineEnd);
          
          const outdentedText = selectedText.split('\n').map(line => {
            if (line.startsWith('  ')) return line.substring(2);
            if (line.startsWith(' ')) return line.substring(1);
            return line;
          }).join('\n');
          
          const newValue = value.substring(0, firstLineStart) + outdentedText + value.substring(lastLineEnd === -1 ? value.length : lastLineEnd);
          onChange(newValue);
        } else {
          // Tab: Indent
          const textBeforeStart = value.substring(0, start);
          const textAfterEnd = value.substring(end);
          const firstLineStart = textBeforeStart.lastIndexOf('\n') + 1;
          const lastLineEnd = value.indexOf('\n', end);
          const selectedText = value.substring(firstLineStart, lastLineEnd === -1 ? value.length : lastLineEnd);
          
          const indentedText = selectedText.split('\n').map(line => '  ' + line).join('\n');
          
          const newValue = value.substring(0, firstLineStart) + indentedText + value.substring(lastLineEnd === -1 ? value.length : lastLineEnd);
          onChange(newValue);
        }
      }
    }

    // Auto closing brackets
    if (e.key === '(' || e.key === '{' || e.key === '[') {
      e.preventDefault();
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const closingBracket = e.key === '(' ? ')' : e.key === '{' ? '}' : ']';
      
      const newValue = 
        value.substring(0, start) + 
        e.key + 
        closingBracket + 
        value.substring(end);
      
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }

    // Auto closing quotes
    if (e.key === '"' || e.key === "'") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Check if next character is already a quote
      if (value[start] === e.key) {
        e.preventDefault();
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
        return;
      }

      e.preventDefault();
      
      const newValue = 
        value.substring(0, start) + 
        e.key + 
        e.key + 
        value.substring(end);
      
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }

    // Auto indentation on Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const start = textarea.selectionStart;
      const currentLine = value.substring(0, start).split('\n').pop() || '';
      const indent = currentLine.match(/^\s*/)?.[0] || '';
      
      // Check if the previous character is an opening bracket
      const prevChar = value[start - 1];
      const nextChar = value[start];
      const extraIndent = (prevChar === '{' || prevChar === '[' || prevChar === '(') ? '  ' : '';
      const addExtraLine = (prevChar === '{' && nextChar === '}') || 
                          (prevChar === '[' && nextChar === ']') ||
                          (prevChar === '(' && nextChar === ')');
      
      if (addExtraLine) {
        const newValue = 
          value.substring(0, start) + 
          '\n' + 
          indent + 
          extraIndent + 
          '\n' + 
          indent + 
          value.substring(start);
        
        onChange(newValue);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + extraIndent.length;
        }, 0);
      } else {
        const newValue = 
          value.substring(0, start) + 
          '\n' + 
          indent + 
          extraIndent + 
          value.substring(start);
        
        onChange(newValue);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + extraIndent.length;
        }, 0);
      }
    }
  };

  // Handle change
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Syntax highlighting
  const highlightSyntax = (code: string): string => {
    if (language !== 'javascript') return code;

    let highlighted = code;

    // Keywords
    const keywords = [
      'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
      'do', 'switch', 'case', 'break', 'continue', 'class', 'extends', 'import',
      'export', 'default', 'async', 'await', 'try', 'catch', 'finally', 'throw',
      'new', 'this', 'super', 'typeof', 'instanceof', 'void', 'delete', 'in', 'of'
    ];
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="keyword">$1</span>');
    });

    // Strings (single and double quotes)
    highlighted = highlighted.replace(
      /(".*?"|'.*?'|`.*?`)/g,
      '<span class="string">$1</span>'
    );

    // Numbers
    highlighted = highlighted.replace(
      /\b(\d+\.?\d*)\b/g,
      '<span class="number">$1</span>'
    );

    // Comments
    highlighted = highlighted.replace(
      /(\/\/.*?$)/gm,
      '<span class="comment">$1</span>'
    );
    highlighted = highlighted.replace(
      /(\/\*[\s\S]*?\*\/)/g,
      '<span class="comment">$1</span>'
    );

    // Functions
    highlighted = highlighted.replace(
      /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
      '<span class="function">$1</span>('
    );

    // Brackets and operators
    highlighted = highlighted.replace(
      /([{}[\]();,.])/g,
      '<span class="punctuation">$1</span>'
    );
    
    highlighted = highlighted.replace(
      /([+\-*/%=<>!&|^~?:])/g,
      '<span class="operator">$1</span>'
    );

    return highlighted;
  };

  // Simple linter for JavaScript
  const lintCode = (code: string): LintError[] => {
    if (language !== 'javascript') return [];
    
    const errors: LintError[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();
      
      // Check for console statements (warning)
      if (/console\.(log|warn|error|info|debug)/.test(line)) {
        errors.push({
          line: lineNum,
          column: line.indexOf('console') + 1,
          message: 'Unexpected console statement',
          severity: 'warning'
        });
      }
      
      // Check for missing semicolons (warning)
      if (trimmedLine && 
          !trimmedLine.endsWith(';') && 
          !trimmedLine.endsWith('{') && 
          !trimmedLine.endsWith('}') &&
          !trimmedLine.startsWith('//') &&
          !trimmedLine.startsWith('/*') &&
          !trimmedLine.startsWith('*') &&
          !/^(if|else|for|while|do|switch|case|default|function|class|try|catch|finally)/.test(trimmedLine)) {
        errors.push({
          line: lineNum,
          column: line.length,
          message: 'Missing semicolon',
          severity: 'warning'
        });
      }
      
      // Check for undefined variables (simple check)
      if (/\b(udefined|undefind)\b/.test(line)) {
        errors.push({
          line: lineNum,
          column: line.indexOf('udef') + 1,
          message: 'Typo: Did you mean "undefined"?',
          severity: 'error'
        });
      }
      
      // Check for unmatched brackets
      const openBrackets = (line.match(/[{[(]/g) || []).length;
      const closeBrackets = (line.match(/[}\])]/g) || []).length;
      if (openBrackets !== closeBrackets) {
        errors.push({
          line: lineNum,
          column: 1,
          message: 'Unmatched brackets on this line',
          severity: 'warning'
        });
      }
    });
    
    return errors;
  };

  // Format code (basic JavaScript formatting)
  const formatCode = () => {
    if (language !== 'javascript') {
      onFormat?.();
      return;
    }
    
    const lines = value.split('\n');
    let formatted = '';
    let indentLevel = 0;
    const indentSize = 2;
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        formatted += '\n';
        return;
      }
      
      // Decrease indent for closing brackets
      if (/^[}\]]/.test(trimmed)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add indentation
      formatted += ' '.repeat(indentLevel * indentSize) + trimmed + '\n';
      
      // Increase indent for opening brackets
      if (/[{[]$/.test(trimmed) && !trimmed.match(/[}\]]/)) {
        indentLevel++;
      }
    });
    
    onChange(formatted.trim());
    onFormat?.();
  };

  // Run linter on code change
  useEffect(() => {
    const errors = lintCode(value);
    setLintErrors(errors);
  }, [value, language]);

  const highlightedCode = highlightSyntax(value);

  return (
    <div className={`code-editor-container ${theme}`}>
      {/* Header with cursor position and controls */}
      <div className="editor-header">
        <div className="editor-info">
          <span className="language-badge">{language.toUpperCase()}</span>
          <span className="cursor-info">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
          <span className="lines-info">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
        </div>
        
        <div className="editor-controls">
          {/* Undo/Redo */}
          <button
            className="control-btn"
            onClick={handleUndo}
            disabled={undoStack.length <= 1}
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            className="control-btn"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>

          <div className="divider"></div>

          {/* Font size controls */}
          <button
            className="control-btn"
            onClick={decreaseFontSize}
            title="Decrease font size (Ctrl+-)"
          >
            A−
          </button>
          <span className="font-size-display">{fontSize}px</span>
          <button
            className="control-btn"
            onClick={increaseFontSize}
            title="Increase font size (Ctrl++)"
          >
            A+
          </button>
          <button
            className="control-btn"
            onClick={resetFontSize}
            title="Reset font size (Ctrl+0)"
          >
            ⟲
          </button>

          <div className="divider"></div>

          {/* Word wrap toggle */}
          <button
            className={`control-btn ${wordWrap ? 'active' : ''}`}
            onClick={() => setWordWrap(!wordWrap)}
            title="Toggle word wrap"
          >
            ⤶
          </button>

          {/* Search button */}
          <button
            className={`control-btn ${showSearch ? 'active' : ''}`}
            onClick={() => {
              setShowSearch(!showSearch);
              setShowReplace(false);
              if (!showSearch) {
                setTimeout(() => searchInputRef.current?.focus(), 0);
              }
            }}
            title="Find (Ctrl+F)"
          >
            🔍
          </button>

          {/* Replace button */}
          <button
            className={`control-btn ${showSearch && showReplace ? 'active' : ''}`}
            onClick={() => {
              setShowSearch(true);
              setShowReplace(!showReplace);
              setTimeout(() => searchInputRef.current?.focus(), 0);
            }}
            title="Replace (Ctrl+H)"
          >
            🔁
          </button>

          <div className="divider"></div>

          {/* Format button */}
          <button
            className="control-btn"
            onClick={formatCode}
            title="Format code (Alt+Shift+F)"
          >
            ✨
          </button>
        </div>
      </div>

      {/* Lint Errors Panel */}
      {lintErrors.length > 0 && (
        <div className="lint-panel">
          <div className="lint-header">
            <span className="lint-title">
              {lintErrors.filter(e => e.severity === 'error').length} errors, 
              {' '}{lintErrors.filter(e => e.severity === 'warning').length} warnings
            </span>
          </div>
          <div className="lint-errors">
            {lintErrors.slice(0, 5).map((error, idx) => (
              <div key={idx} className={`lint-error ${error.severity}`}>
                <span className="lint-location">Ln {error.line}, Col {error.column}</span>
                <span className="lint-message">{error.message}</span>
              </div>
            ))}
            {lintErrors.length > 5 && (
              <div className="lint-more">+ {lintErrors.length - 5} more</div>
            )}
          </div>
        </div>
      )}

      {/* Search and Replace Panel */}
      {showSearch && (
        <div className="search-panel">
          <div className="search-row">
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Find..."
              value={searchState.query}
              onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.shiftKey ? findPrevious() : findNext();
                } else if (e.key === 'Escape') {
                  setShowSearch(false);
                  setShowReplace(false);
                  textareaRef.current?.focus();
                }
              }}
            />
            <div className="search-results">
              {searchState.totalMatches > 0 && (
                <span>
                  {searchState.currentMatch} of {searchState.totalMatches}
                </span>
              )}
            </div>
            <label className="case-sensitive-toggle">
              <input
                type="checkbox"
                checked={searchState.caseSensitive}
                onChange={(e) => setSearchState(prev => ({ ...prev, caseSensitive: e.target.checked }))}
              />
              <span>Aa</span>
            </label>
            <button
              className="search-btn"
              onClick={findPrevious}
              disabled={searchState.totalMatches === 0}
              title="Find previous (Shift+Enter)"
            >
              ▲
            </button>
            <button
              className="search-btn"
              onClick={findNext}
              disabled={searchState.totalMatches === 0}
              title="Find next (Enter)"
            >
              ▼
            </button>
            <button
              className="search-btn close-btn"
              onClick={() => {
                setShowSearch(false);
                setShowReplace(false);
                textareaRef.current?.focus();
              }}
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>

          {showReplace && (
            <div className="replace-row">
              <input
                type="text"
                className="search-input"
                placeholder="Replace with..."
                value={searchState.replaceWith}
                onChange={(e) => setSearchState(prev => ({ ...prev, replaceWith: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    replaceNext();
                  }
                }}
              />
              <button
                className="replace-btn"
                onClick={replaceNext}
                disabled={searchState.totalMatches === 0}
              >
                Replace
              </button>
              <button
                className="replace-btn"
                onClick={replaceAll}
                disabled={searchState.totalMatches === 0}
              >
                Replace All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Editor body */}
      <div className="editor-body" style={{ fontSize: `${fontSize}px` }}>
        {/* Line numbers */}
        <div 
          ref={lineNumbersRef}
          className="line-numbers"
          style={{ top: -scrollTop }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i + 1}
              className={`line-number ${i + 1 === cursorPosition.line ? 'active' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Syntax highlighting layer */}
        <pre
          ref={highlightRef}
          className={`syntax-highlight ${wordWrap ? 'word-wrap' : ''}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />

        {/* Text area (actual input) */}
        <textarea
          ref={textareaRef}
          className={`code-input ${wordWrap ? 'word-wrap' : ''}`}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          readOnly={readOnly}
          placeholder="// Start typing your code here..."
        />
      </div>
    </div>
  );
};

export default CustomCodeEditor;
