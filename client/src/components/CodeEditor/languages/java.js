/**
 * Java Language Definition
 */

export const java = {
  name: 'java',
  aliases: [],
  extensions: ['.java'],
  
  keywords: [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
    'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
    'extends', 'false', 'final', 'finally', 'float', 'for', 'goto', 'if',
    'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native',
    'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short',
    'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw',
    'throws', 'transient', 'true', 'try', 'void', 'volatile', 'while', 'var',
    'yield', 'record', 'sealed', 'permits'
  ],

  builtins: [
    'System', 'String', 'Integer', 'Double', 'Float', 'Long', 'Boolean', 'Character',
    'Math', 'ArrayList', 'HashMap', 'HashSet', 'TreeMap', 'LinkedList', 'Queue',
    'Stack', 'Exception', 'RuntimeException', 'Object', 'Class', 'Thread',
    'Runnable', 'synchronized', 'println', 'print', 'out', 'in', 'err'
  ],

  tokenRules: [
    // Comments
    { pattern: /\/\/.*$/, type: 'comment' },
    { pattern: /\/\*[\s\S]*?\*\//, type: 'comment' },
    
    // Strings
    { pattern: /"(?:\\.|[^"\\])*"/, type: 'string' },
    { pattern: /'(?:\\.|[^'\\])*'/, type: 'char' },
    
    // Numbers
    { pattern: /\b(?:0x[0-9a-fA-F]+|0[0-7]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)[lLfFdD]?\b/, type: 'number' },
    
    // Keywords
    { pattern: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|false|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|true|try|void|volatile|while|var|yield|record|sealed|permits)\b/, type: 'keyword' },
    
    // Built-in classes and methods
    { pattern: /\b(System|String|Integer|Double|ArrayList|HashMap|Exception|Thread|Object|Class)\b/, type: 'builtin' },
    
    // Annotations
    { pattern: /@[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*/, type: 'annotation' },
    
    // Class definitions
    { pattern: /\b(class|interface|enum)\s+([a-zA-Z_][a-zA-Z0-9_]*)/,
      type: 'class',
      subMatches: [
        { index: 1, type: 'keyword' },
        { index: 2, type: 'class-name' }
      ]
    },
    
    // Method definitions
    { pattern: /\b(public|private|protected)?[\s]+(static)?[\s]*\b(void|int|String|boolean|double|float|long)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/,
      type: 'method',
      subMatches: [
        { index: 4, type: 'method-name' }
      ]
    },
    
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
    indentSize: 4,
    indentType: 'spaces'
  },

  autoCompletionRules: {
    quotes: true,
    brackets: true,
    semicolons: true
  }
};

export default java;
