/**
 * SyntaxHighlighter.js
 * =====================
 * Pure utility module for syntax highlighting
 * 
 * Features:
 * - Token-based highlighting for JavaScript
 * - Regex-based pattern matching
 * - HTML-safe escaping
 * - Extensible architecture for multiple languages
 * - Performance optimized with caching
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - Raw string
 * @returns {string} - HTML-safe string
 */
const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * JavaScript token patterns
 * Order matters - more specific patterns should come first
 */
const JS_PATTERNS = {
  // Multi-line comments (must come before single-line)
  multiLineComment: {
    pattern: /\/\*[\s\S]*?\*\//g,
    className: 'comment'
  },
  
  // Single-line comments
  singleLineComment: {
    pattern: /\/\/.*?$/gm,
    className: 'comment'
  },
  
  // String literals (template, double, single quotes)
  templateString: {
    pattern: /`(?:\\.|[^`\\])*`/g,
    className: 'string'
  },
  
  doubleQuoteString: {
    pattern: /"(?:\\.|[^"\\])*"/g,
    className: 'string'
  },
  
  singleQuoteString: {
    pattern: /'(?:\\.|[^'\\])*'/g,
    className: 'string'
  },
  
  // Regular expressions
  regex: {
    pattern: /\/(?![/*])(?:\\.|[^/\\])+\/[gimuy]*/g,
    className: 'regex'
  },
  
  // Numbers (hex, binary, octal, decimal, scientific)
  number: {
    pattern: /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g,
    className: 'number'
  },
  
  // Keywords
  keyword: {
    pattern: /\b(?:abstract|arguments|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield|async|of)\b/g,
    className: 'keyword'
  },
  
  // Built-in objects and functions
  builtin: {
    pattern: /\b(?:Array|Boolean|Date|Error|Function|JSON|Math|Number|Object|Promise|RegExp|String|Symbol|console|document|window|parseInt|parseFloat|isNaN|isFinite|decodeURI|encodeURI|decodeURIComponent|encodeURIComponent|eval|setTimeout|setInterval|clearTimeout|clearInterval)\b/g,
    className: 'builtin'
  },
  
  // Function names (before parentheses)
  functionName: {
    pattern: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    className: 'function'
  },
  
  // Class names (capitalized identifiers)
  className: {
    pattern: /\b[A-Z][a-zA-Z0-9_$]*\b/g,
    className: 'class-name'
  },
  
  // Operators
  operator: {
    pattern: /[+\-*/%=<>!&|^~?:]+|\.{3}|=>|&&|\|\||===|!==|==|!=|<=|>=/g,
    className: 'operator'
  },
  
  // Punctuation
  punctuation: {
    pattern: /[{}[\]();,.:]/g,
    className: 'punctuation'
  }
};

/**
 * Highlight JavaScript code
 * @param {string} code - Raw code string
 * @returns {string} - HTML string with syntax highlighting
 */
const highlightJavaScript = (code) => {
  if (!code) return '';
  
  // Store original code for replacement tracking
  let highlighted = escapeHtml(code);
  
  // Map to track positions we've already highlighted
  const replacements = [];
  
  // Find all matches for each pattern
  Object.entries(JS_PATTERNS).forEach(([name, { pattern, className }]) => {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    
    while ((match = regex.exec(code)) !== null) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        className,
        priority: Object.keys(JS_PATTERNS).indexOf(name) // Earlier patterns have priority
      });
    }
  });
  
  // Sort by start position, then by priority (lower priority number = higher precedence)
  replacements.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return a.priority - b.priority;
  });
  
  // Remove overlapping matches (keep higher priority ones)
  const filteredReplacements = [];
  let lastEnd = -1;
  
  replacements.forEach(replacement => {
    if (replacement.start >= lastEnd) {
      filteredReplacements.push(replacement);
      lastEnd = replacement.end;
    }
  });
  
  // Build highlighted string from back to front to maintain positions
  filteredReplacements.reverse().forEach(({ start, end, text, className }) => {
    const escapedText = escapeHtml(text);
    const before = highlighted.substring(0, start);
    const after = highlighted.substring(end);
    highlighted = before + `<span class="${className}">${escapedText}</span>` + after;
  });
  
  return highlighted;
};

/**
 * Python syntax highlighting (basic implementation)
 * Can be extended for production use
 */
const highlightPython = (code) => {
  if (!code) return '';
  
  let highlighted = escapeHtml(code);
  
  // Python keywords
  const keywords = /\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g;
  highlighted = highlighted.replace(keywords, '<span class="keyword">$1</span>');
  
  // Strings
  highlighted = highlighted.replace(/"""[\s\S]*?"""/g, '<span class="string">$&</span>');
  highlighted = highlighted.replace(/'''[\s\S]*?'''/g, '<span class="string">$&</span>');
  highlighted = highlighted.replace(/"(?:\\.|[^"\\])*"/g, '<span class="string">$&</span>');
  highlighted = highlighted.replace(/'(?:\\.|[^'\\])*'/g, '<span class="string">$&</span>');
  
  // Comments
  highlighted = highlighted.replace(/#.*$/gm, '<span class="comment">$&</span>');
  
  // Numbers
  highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="number">$&</span>');
  
  return highlighted;
};

/**
 * Main highlighting function
 * Routes to appropriate language highlighter
 * 
 * @param {string} code - Source code
 * @param {string} language - Programming language
 * @returns {string} - Highlighted HTML
 */
export const highlightCode = (code, language = 'javascript') => {
  if (!code) return '';
  
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
    case 'jsx':
    case 'typescript':
    case 'ts':
    case 'tsx':
      return highlightJavaScript(code);
      
    case 'python':
    case 'py':
      return highlightPython(code);
      
    default:
      // Fallback: return escaped HTML without highlighting
      return escapeHtml(code);
  }
};

/**
 * Get line count from code
 * @param {string} code - Source code
 * @returns {number} - Number of lines
 */
export const getLineCount = (code) => {
  if (!code) return 1;
  return code.split('\n').length;
};

/**
 * Get cursor position info
 * @param {string} code - Source code
 * @param {number} cursorPos - Cursor position (character index)
 * @returns {Object} - {line, column}
 */
export const getCursorPosition = (code, cursorPos) => {
  const textBeforeCursor = code.substring(0, cursorPos);
  const line = textBeforeCursor.split('\n').length;
  const lastLineBreak = textBeforeCursor.lastIndexOf('\n');
  const column = cursorPos - lastLineBreak;
  
  return { line, column };
};

/**
 * Memoization cache for highlighting
 * Improves performance by caching highlighted results
 */
const highlightCache = new Map();
const MAX_CACHE_SIZE = 50;

/**
 * Cached highlight function
 * @param {string} code - Source code
 * @param {string} language - Programming language
 * @returns {string} - Highlighted HTML
 */
export const highlightCodeCached = (code, language = 'javascript') => {
  const cacheKey = `${language}:${code}`;
  
  // Check cache
  if (highlightCache.has(cacheKey)) {
    return highlightCache.get(cacheKey);
  }
  
  // Highlight and cache
  const result = highlightCode(code, language);
  
  // Manage cache size
  if (highlightCache.size >= MAX_CACHE_SIZE) {
    const firstKey = highlightCache.keys().next().value;
    highlightCache.delete(firstKey);
  }
  
  highlightCache.set(cacheKey, result);
  return result;
};

/**
 * Clear highlight cache (useful for memory management)
 */
export const clearHighlightCache = () => {
  highlightCache.clear();
};

export default {
  highlightCode,
  highlightCodeCached,
  getLineCount,
  getCursorPosition,
  clearHighlightCache
};
