/**
 * JavaScript Language Definition
 * Includes ES6+ syntax support
 */

export const javascript = {
  name: 'javascript',
  aliases: ['js', 'jsx'],
  extensions: ['.js', '.jsx', '.mjs'],
  
  keywords: [
    'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch',
    'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
    'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final',
    'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import',
    'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new',
    'null', 'package', 'private', 'protected', 'public', 'return', 'short',
    'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
    'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while',
    'with', 'yield', 'async', 'from', 'as', 'get', 'set', 'of'
  ],

  builtins: [
    'Array', 'Boolean', 'Date', 'Error', 'Function', 'Math', 'Number', 'Object',
    'RegExp', 'String', 'Symbol', 'Promise', 'Proxy', 'Map', 'Set', 'WeakMap',
    'WeakSet', 'Reflect', 'JSON', 'console', 'setTimeout', 'setInterval',
    'clearTimeout', 'clearInterval', 'parseInt', 'parseFloat', 'isNaN', 'isFinite',
    'encodeURI', 'decodeURI', 'encodeURIComponent', 'decodeURIComponent',
    'require', 'module', 'exports', '__dirname', '__filename'
  ],

  tokenRules: [
    // Comments
    { pattern: /\/\/.*$/, type: 'comment' },
    { pattern: /\/\*[\s\S]*?\*\//, type: 'comment' },
    
    // Strings
    { pattern: /"(?:\\.|[^"\\])*"/, type: 'string' },
    { pattern: /'(?:\\.|[^'\\])*'/, type: 'string' },
    { pattern: /`(?:\\.|[^`\\])*`/, type: 'string' },
    
    // Numbers
    { pattern: /\b(?:0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)\b/, type: 'number' },
    
    // Regular expressions
    { pattern: /\/(?:\\.|[^/\\\n])+\/[gimyus]*/, type: 'regex' },
    
    // Keywords
    { pattern: /\b(abstract|arguments|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield|async|from|as|get|set|of)\b/, type: 'keyword' },
    
    // Built-in functions/objects
    { pattern: /\b(console|Math|Array|Object|String|Number|Boolean|Date|Function|setTimeout|setInterval|Promise|Map|Set|JSON)\b/, type: 'builtin' },
    
    // Function definitions
    { pattern: /\b(function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/,
      type: 'function',
      subMatches: [
        { index: 1, type: 'keyword' },
        { index: 2, type: 'function-name' }
      ]
    },
    
    // Class definitions
    { pattern: /\b(class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/,
      type: 'class',
      subMatches: [
        { index: 1, type: 'keyword' },
        { index: 2, type: 'class-name' }
      ]
    },
    
    // Operators
    { pattern: /[+\-*/%=!<>&|^~?:]+/, type: 'operator' },
    
    // Punctuation
    { pattern: /[{}()\[\];,.]/, type: 'punctuation' },
    
    // Identifiers
    { pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/, type: 'identifier' }
  ],

  bracketPairs: [
    { open: '{', close: '}', type: 'brace' },
    { open: '[', close: ']', type: 'bracket' },
    { open: '(', close: ')', type: 'paren' },
    { open: '"', close: '"', type: 'quote' },
    { open: "'", close: "'", type: 'quote' },
    { open: '`', close: '`', type: 'template' }
  ],

  commentSyntax: {
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/'
  },

  indentationRules: {
    increaseAfter: /[{([]/,
    decreaseAfter: /[}\])]/,
    indentSize: 2,
    indentType: 'spaces' // or 'tabs'
  },

  autoCompletionRules: {
    quotes: true,
    brackets: true,
    semicolons: true
  }
};

export default javascript;
