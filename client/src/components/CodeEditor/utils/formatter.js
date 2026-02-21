/**
 * Code Formatter Utility
 * Basic code formatting for multiple languages
 */

export const formatter = {
  // Format code with proper indentation
  formatCode(code, language = 'javascript', indentSize = 2) {
    const lines = code.split('\n');
    const formatted = [];
    let indentLevel = 0;
    const indent = ' '.repeat(indentSize);

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trimStart();
      
      // Skip empty lines
      if (!line) {
        formatted.push('');
        continue;
      }

      // Decrease indent before closing braces
      if (/^[}\])]/.test(line)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add indentation
      const formattedLine = indent.repeat(indentLevel) + line;
      formatted.push(formattedLine);

      // Increase indent after opening braces
      if (/[{([]:?\s*$/.test(line)) {
        indentLevel++;
      }
    }

    return formatted.join('\n');
  },

  // Add semicolons if missing (JavaScript/Java)
  addSemicolons(code, language) {
    if (!['javascript', 'java', 'c', 'cpp'].includes(language)) {
      return code;
    }

    const lines = code.split('\n');
    return lines.map(line => {
      const trimmed = line.trimEnd();
      if (!trimmed || /[{}:;,]$/.test(trimmed) || trimmed.endsWith('(')) {
        return trimmed;
      }
      return trimmed + ';';
    }).join('\n');
  },

  // Remove trailing whitespace
  removeTrailingWhitespace(code) {
    return code.split('\n')
      .map(line => line.trimEnd())
      .join('\n');
  },

  // Normalize line endings (CRLF to LF)
  normalizeLineEndings(code) {
    return code.replace(/\r\n/g, '\n');
  },

  // Insert spaces around operators
  formatOperators(code, language) {
    if (!['javascript', 'java', 'c', 'cpp', 'python'].includes(language)) {
      return code;
    }

    // Add spaces around binary operators (but not in strings/comments)
    let result = code;
    const operators = ['==', '!=', '<=', '>=', '&&', '||', '='];
    
    operators.forEach(op => {
      const pattern = new RegExp(`(\\S)\\${op}(\\S)`, 'g');
      result = result.replace(pattern, `$1 ${op} $2`);
    });

    return result;
  },

  // Minify code (remove unnecessary whitespace)
  minify(code) {
    // Remove comments
    let minified = code
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    // Remove unnecessary whitespace
    minified = minified
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}()[\];:,])\s*/g, '$1');

    return minified.trim();
  },

  // Pretty-print minified code
  prettyPrint(code, indentSize = 2) {
    let result = '';
    let indentLevel = 0;
    const indent = ' '.repeat(indentSize);

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      if (char === '{' || char === '[' || char === '(') {
        result += char;
        if (char === '{' || char === '[') {
          result += '\n' + indent.repeat(++indentLevel);
        }
      } else if (char === '}' || char === ']') {
        result += '\n' + indent.repeat(--indentLevel) + char;
        if (i + 1 < code.length && code[i + 1] !== ',') {
          result += '\n' + indent.repeat(indentLevel);
        }
      } else if (char === ';' || char === ',') {
        result += char + '\n' + indent.repeat(indentLevel);
      } else if (char === ')') {
        result += char;
      } else {
        result += char;
      }
    }

    return result;
  }
};

export default formatter;
