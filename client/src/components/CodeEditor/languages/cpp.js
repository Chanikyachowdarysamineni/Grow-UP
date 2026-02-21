/**
 * C++ Language Definition
 */

export const cpp = {
  name: 'cpp',
  aliases: ['c++'],
  extensions: ['.cpp', '.cc', '.cxx', '.h', '.hpp', '.hxx'],
  
  keywords: [
    'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor',
    'bool', 'break', 'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t',
    'class', 'compl', 'concept', 'const', 'consteval', 'constexpr', 'constinit',
    'const_cast', 'continue', 'co_await', 'co_return', 'co_yield', 'decltype',
    'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum',
    'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'goto',
    'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept',
    'not', 'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected',
    'public', 'register', 'reinterpret_cast', 'requires', 'return', 'short',
    'signed', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct',
    'switch', 'template', 'this', 'thread_local', 'throw', 'true', 'try',
    'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual',
    'void', 'volatile', 'while', 'xor', 'xor_eq'
  ],

  builtins: [
    'std', 'cout', 'cin', 'endl', 'string', 'vector', 'map', 'set', 'queue',
    'stack', 'deque', 'list', 'algorithm', 'iostream', 'fstream', 'sstream',
    'iomanip', 'memory', 'functional', 'utility', 'array', 'iterator'
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
    { pattern: /\b(alignas|alignof|and|and_eq|asm|auto|bitand|bitor|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|compl|concept|const|consteval|constexpr|constinit|const_cast|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|not|not_eq|nullptr|operator|or|or_eq|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|while|xor|xor_eq)\b/, type: 'keyword' },
    
    // Built-in namespaces and functions
    { pattern: /\b(std|cout|cin|endl|printf|scanf|malloc|free|strcpy|strlen)\b/, type: 'builtin' },
    
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

export default cpp;
