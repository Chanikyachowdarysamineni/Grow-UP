/**
 * Python Language Definition
 */

export const python = {
  name: 'python',
  aliases: ['py'],
  extensions: ['.py'],
  
  keywords: [
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
    'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
  ],

  builtins: [
    'abs', 'aiter', 'all', 'anext', 'any', 'ascii', 'bin', 'bool', 'breakpoint',
    'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 'compile', 'complex',
    'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter',
    'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash',
    'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len',
    'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object',
    'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr', 'reversed',
    'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum',
    'super', 'tuple', 'type', 'vars', 'zip'
  ],

  tokenRules: [
    // Comments
    { pattern: /#.*$/, type: 'comment' },
    
    // Docstrings and strings
    { pattern: /"""[\s\S]*?"""/, type: 'string' },
    { pattern: /'''[\s\S]*?'''/, type: 'string' },
    { pattern: /"(?:\\.|[^"\\])*"/, type: 'string' },
    { pattern: /'(?:\\.|[^'\\])*'/, type: 'string' },
    
    // Numbers
    { pattern: /\b(?:0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[jJ]?)\b/, type: 'number' },
    
    // Keywords
    { pattern: /\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/, type: 'keyword' },
    
    // Built-in functions
    { pattern: /\b(print|len|range|str|int|float|list|dict|set|tuple|type|isinstance|hasattr|getattr|setattr|callable|map|filter|zip|enumerate|sorted|reversed|sum|min|max|abs|all|any|open|input|eval|exec)\b/, type: 'builtin' },
    
    // Function definitions
    { pattern: /\b(def|async\s+def)\s+([a-zA-Z_][a-zA-Z0-9_]*)/,
      type: 'function',
      subMatches: [
        { index: 1, type: 'keyword' },
        { index: 2, type: 'function-name' }
      ]
    },
    
    // Class definitions
    { pattern: /\b(class)\s+([a-zA-Z_][a-zA-Z0-9_]*)/,
      type: 'class',
      subMatches: [
        { index: 1, type: 'keyword' },
        { index: 2, type: 'class-name' }
      ]
    },
    
    // Decorators
    { pattern: /@[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*/, type: 'decorator' },
    
    // Operators
    { pattern: /[+\-*/%=!<>&|^~?:]+/, type: 'operator' },
    
    // Punctuation
    { pattern: /[{}()\[\];,.]/, type: 'punctuation' },
    
    // Identifiers
    { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/, type: 'identifier' }
  ],

  bracketPairs: [
    { open: '{', close: '}', type: 'brace' },
    { open: '[', close: ']', type: 'bracket' },
    { open: '(', close: ')', type: 'paren' },
    { open: '"', close: '"', type: 'quote' },
    { open: "'", close: "'", type: 'quote' }
  ],

  commentSyntax: {
    lineComment: '#'
  },

  indentationRules: {
    increaseAfter: /[:]\s*$/,
    decreaseAfter: /^\s*(elif|else|except|finally)\b/,
    indentSize: 4,
    indentType: 'spaces'
  },

  autoCompletionRules: {
    quotes: true,
    brackets: true,
    semicolons: false
  }
};

export default python;
