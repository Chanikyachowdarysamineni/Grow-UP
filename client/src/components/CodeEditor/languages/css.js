/**
 * CSS Language Definition
 */

export const css = {
  name: 'css',
  aliases: [],
  extensions: ['.css'],
  
  keywords: [
    'important', 'not', 'only', 'and', 'or'
  ],

  tokenRules: [
    // Comments
    { pattern: /\/\*[\s\S]*?\*\//, type: 'comment' },
    
    // Selectors - ID
    { pattern: /#[a-zA-Z_-][a-zA-Z0-9_-]*/, type: 'selector-id' },
    
    // Selectors - Class
    { pattern: /\.[a-zA-Z_-][a-zA-Z0-9_-]*/, type: 'selector-class' },
    
    // Selectors - Tag
    { pattern: /\b(div|span|p|a|button|input|form|label|select|textarea|h1|h2|h3|h4|h5|h6|ul|ol|li|table|tr|td|th|header|footer|nav|section|article|aside|main)\b/, type: 'tag-selector' },
    
    // Property names
    { pattern: /([a-zA-Z-][a-zA-Z0-9-]*)\s*:/, type: 'property' },
    
    // Color values
    { pattern: /#[0-9a-fA-F]{3,6}\b/, type: 'color-hex' },
    { pattern: /\b(red|blue|green|yellow|black|white|orange|purple|pink|brown|gray|silver|gold|cyan|magenta|lime|navy|teal|olive|maroon|aqua|fuchsia)\b/, type: 'color-name' },
    { pattern: /rgb\([^)]*\)/, type: 'color-rgb' },
    { pattern: /rgba\([^)]*\)/, type: 'color-rgba' },
    { pattern: /hsl\([^)]*\)/, type: 'color-hsl' },
    
    // Numbers and units
    { pattern: /(\d+(?:\.\d+)?)(%|px|em|rem|pt|cm|mm|in|vh|vw|vmin|vmax|ch|ex)/, type: 'unit' },
    { pattern: /\d+(?:\.\d+)?/, type: 'number' },
    
    // Strings
    { pattern: /"(?:\\.|[^"\\])*"/, type: 'string' },
    { pattern: /'(?:\\.|[^'\\])*'/, type: 'string' },
    
    // URL
    { pattern: /url\([^)]*\)/, type: 'url' },
    
    // At-rules
    { pattern: /@[a-zA-Z-][a-zA-Z0-9-]*/, type: 'at-rule' },
    
    // Pseudo-selectors
    { pattern: /:[a-zA-Z-][a-zA-Z0-9-]*/, type: 'pseudo-selector' },
    
    // Pseudo-elements
    { pattern: /::[a-zA-Z-][a-zA-Z0-9-]*/, type: 'pseudo-element' },
    
    // Operators and punctuation
    { pattern: /[{}()[\];:,>+~]/, type: 'punctuation' },
    { pattern: /[=|*^$~]/, type: 'operator' }
  ],

  bracketPairs: [
    { open: '{', close: '}', type: 'brace' },
    { open: '[', close: ']', type: 'bracket' },
    { open: '(', close: ')', type: 'paren' }
  ],

  commentSyntax: {
    blockCommentStart: '/*',
    blockCommentEnd: '*/'
  },

  indentationRules: {
    increaseAfter: /[{]/,
    decreaseAfter: /[}]/,
    indentSize: 2,
    indentType: 'spaces'
  },

  autoCompletionRules: {
    quotes: true,
    brackets: true,
    semicolons: false
  }
};

export default css;
