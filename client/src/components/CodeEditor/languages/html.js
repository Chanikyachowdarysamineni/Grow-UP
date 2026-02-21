/**
 * HTML Language Definition
 */

export const html = {
  name: 'html',
  aliases: [],
  extensions: ['.html', '.htm'],
  
  keywords: [
    'DOCTYPE', 'html', 'head', 'body', 'title', 'meta', 'link', 'style',
    'script', 'div', 'span', 'p', 'a', 'button', 'input', 'form', 'label',
    'select', 'textarea', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol',
    'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'img', 'img',
    'nav', 'header', 'footer', 'section', 'article', 'aside', 'main', 'iframe',
    'video', 'audio', 'canvas', 'svg'
  ],

  tokenRules: [
    // Comments
    { pattern: /<!--[\s\S]*?-->/, type: 'comment' },
    
    // DOCTYPE
    { pattern: /<!DOCTYPE[^>]*>/i, type: 'doctype' },
    
    // Tags
    { pattern: /<[/]?([a-zA-Z][a-zA-Z0-9-]*)[^>]*>/,
      type: 'tag',
      subMatches: [
        { index: 1, type: 'tag-name' }
      ]
    },
    
    // Attribute values (strings)
    { pattern: /="[^"]*"/, type: 'attr-value' },
    { pattern: /='[^']*'/, type: 'attr-value' },
    
    // Attribute names
    { pattern: /\b[a-zA-Z][a-zA-Z0-9-]*(?==)/, type: 'attr-name' },
    
    // HTML entities
    { pattern: /&[a-zA-Z]+;/, type: 'entity' },
    
    // Text content
    { pattern: /[^<>&]+/, type: 'text' },
    
    // Operators
    { pattern: /[=]/, type: 'operator' }
  ],

  bracketPairs: [
    { open: '<', close: '>', type: 'angle' },
    { open: '{', close: '}', type: 'brace' },
    { open: '[', close: ']', type: 'bracket' },
    { open: '(', close: ')', type: 'paren' }
  ],

  commentSyntax: {
    blockCommentStart: '<!--',
    blockCommentEnd: '-->'
  },

  indentationRules: {
    increaseAfter: /<(?!\/)[^/>]*>/,
    decreaseAfter: /<\/[^>]*>/,
    indentSize: 2,
    indentType: 'spaces'
  },

  autoCompletionRules: {
    quotes: true,
    brackets: true,
    semicolons: false
  }
};

export default html;
