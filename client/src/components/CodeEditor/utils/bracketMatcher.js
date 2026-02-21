/**
 * Bracket Matcher Utility
 * Handles bracket matching, auto-closing, and highlighting
 */

export const bracketMatcher = {
  // Find matching bracket pair
  findMatchingBracket(code, position, direction = 'forward') {
    const char = code[position];
    const pairs = {
      '{': '}',
      '[': ']',
      '(': ')',
      '"': '"',
      "'": "'",
      '`': '`'
    };
    
    const closingPairs = {
      '}': '{',
      ']': '[',
      ')': '(',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    let matchChar = pairs[char] || closingPairs[char];
    if (!matchChar) return -1;

    let count = 1;
    let i = position + (direction === 'forward' ? 1 : -1);
    const increment = direction === 'forward' ? 1 : -1;

    while (i >= 0 && i < code.length && count > 0) {
      if (code[i] === char) count++;
      if (code[i] === matchChar) count--;
      if (count === 0) return i;
      i += increment;
    }

    return -1;
  },

  // Check if brackets are balanced
  areBracketsBalanced(code) {
    const stack = [];
    const pairs = { '{': '}', '[': ']', '(': ')' };
    let inString = false;
    let stringChar = null;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      // Handle string literals
      if ((char === '"' || char === "'") && code[i - 1] !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
        continue;
      }

      if (inString) continue;

      // Skip comments
      if (char === '/' && code[i + 1] === '/') {
        while (i < code.length && code[i] !== '\n') i++;
        continue;
      }

      if (char === '/' && code[i + 1] === '*') {
        while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i++;
        i += 2;
        continue;
      }

      if (pairs[char]) {
        stack.push(char);
      } else {
        const openBracket = Object.keys(pairs).find(k => pairs[k] === char);
        if (openBracket) {
          if (!stack.length || stack[stack.length - 1] !== openBracket) {
            return false;
          }
          stack.pop();
        }
      }
    }

    return stack.length === 0;
  },

  // Get bracket position for highlighting
  getBracketHighlights(code, cursorPos) {
    const char = code[cursorPos];
    const pairs = { '{': '}', '[': ']', '(': ')' };
    const closingPairs = {}; 
    Object.entries(pairs).forEach(([k, v]) => { closingPairs[v] = k; });

    if (!pairs[char] && !closingPairs[char]) return null;

    const matchPos = this.findMatchingBracket(code, cursorPos);
    return matchPos >= 0 ? { start: cursorPos, end: matchPos } : null;
  },

  // Auto-close bracket on insertion
  shouldAutoCloseBracket(char, nextChar) {
    const closeLess = ['{', '[', '(', '"', "'", '`'];
    const whitespace = [' ', '\n', '\t'];
    const endChars = [';', ',', ')', ']', '}', ':', ''];

    return closeLess.includes(char) && 
           (endChars.includes(nextChar) || whitespace.includes(nextChar) || nextChar === undefined);
  },

  // Get auto-close pair
  getAutoClosePair(char) {
    const pairs = {
      '{': '}',
      '[': ']',
      '(': ')',
      '"': '"',
      "'": "'",
      '`': '`'
    };
    return pairs[char] || null;
  }
};

export default bracketMatcher;
