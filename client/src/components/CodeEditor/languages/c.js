/**
 * C Language Definition
 */

export const c = {
  name: 'c',
  aliases: [],
  extensions: ['.c', '.h'],
  
  keywords: [
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
    'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'inline',
    'int', 'long', 'register', 'restrict', 'return', 'short', 'signed', 'sizeof',
    'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void',
    'volatile', 'while', '_Bool', '_Complex', '_Imaginary', '_Noreturn',
    '_Static', '_Thread_local', '_Alignas', '_Alignof', '_Atomic', '_Generic'
  ],

  builtins: [
    'printf', 'scanf', 'malloc', 'free', 'calloc', 'realloc', 'strcpy', 'strlen',
    'strcat', 'strcmp', 'memcpy', 'memset', 'exit', 'main', 'fopen', 'fclose',
    'fread', 'fwrite', 'puts', 'gets', 'getchar', 'putchar'
  ],

  tokenRules: [
    // Comments
    { pattern: /\/\/.*$/, type: 'comment' },
    { pattern: /\/\*[\s\S]*?\*\//, type: 'comment' },
    
    // Preprocessor directives
    { pattern: /#\s*(?:include|define|ifdef|endif|ifndef|if|else|elif|pragma)[^\n]*/, type: 'preprocessor' },
    
    // Strings
    { pattern: /"(?:\\.|[^"\\])*"/, type: 'string' },
    { pattern: /'(?:\\.|[^'\\])*'/, type: 'char' },
    
    // Numbers
    { pattern: /\b(?:0x[0-9a-fA-F]+|0[0-7]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)[uUlLfF]*\b/, type: 'number' },
    
    // Keywords
    { pattern: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/, type: 'keyword' },
    
    // Built-in functions
    { pattern: /\b(printf|scanf|malloc|free|strcpy|strlen|strcmp|memcpy|memset|fopen|fclose|fread|fwrite)\b/, type: 'builtin' },
    
    // Function definitions
    { pattern: /([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/, type: 'function-call' },
    
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
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/'
  },

  indentationRules: {
    increaseAfter: /[{([]/,
    decreaseAfter: /[}\])]/,
    indentSize: 2,
    indentType: 'spaces'
  },

  autoCompletionRules: {
    quotes: true,
    brackets: true,
    semicolons: true
  }
};

export default c;
