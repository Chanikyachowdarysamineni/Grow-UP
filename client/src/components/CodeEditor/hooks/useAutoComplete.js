/**
 * useAutoComplete.js
 * ==================
 * Custom hook for auto-completion features
 * 
 * Features:
 * - Auto-closing brackets: (), {}, []
 * - Auto-closing quotes: "", '', ``
 * - Auto-indentation on Enter
 * - Smart bracket deletion
 * - Tab/Shift+Tab indentation
 * - Selection wrapping
 */

import { useCallback } from 'react';

// Configuration
const INDENT_SIZE = 2; // Number of spaces for indentation
const INDENT_STRING = ' '.repeat(INDENT_SIZE);

// Bracket/quote pairs
const PAIRS = {
  '(': ')',
  '{': '}',
  '[': ']',
  '"': '"',
  "'": "'",
  '`': '`'
};

// Opening brackets that increase indentation
const OPENING_BRACKETS = ['{', '[', '('];
const CLOSING_BRACKETS = ['}', ']', ')'];

/**
 * useAutoComplete Hook
 * 
 * @returns {Object} - Auto-complete helper functions
 */
export const useAutoComplete = () => {
  /**
   * Get current line indentation
   * @param {string} code - Full code string
   * @param {number} cursorPos - Current cursor position
   * @returns {string} - Indentation string (spaces)
   */
  const getCurrentIndentation = useCallback((code, cursorPos) => {
    const beforeCursor = code.substring(0, cursorPos);
    const lastLineBreak = beforeCursor.lastIndexOf('\n');
    const currentLine = beforeCursor.substring(lastLineBreak + 1);
    
    const match = currentLine.match(/^(\s*)/);
    return match ? match[1] : '';
  }, []);

  /**
   * Check if cursor is between matching pairs
   * @param {string} code - Full code
   * @param {number} cursorPos - Cursor position
   * @param {string} openChar - Opening character
   * @returns {boolean}
   */
  const isBetweenPairs = useCallback((code, cursorPos, openChar) => {
    if (!PAIRS[openChar]) return false;
    
    const closeChar = PAIRS[openChar];
    const before = code[cursorPos - 1];
    const after = code[cursorPos];
    
    return before === openChar && after === closeChar;
  }, []);

  /**
   * Handle auto-closing of brackets and quotes
   * 
   * @param {string} char - Character being typed
   * @param {string} code - Current code
   * @param {number} selectionStart - Selection start
   * @param {number} selectionEnd - Selection end
   * @returns {Object|null} - {newCode, newCursorPos} or null if no auto-close
   */
  const handleAutoClose = useCallback((char, code, selectionStart, selectionEnd) => {
    const closeChar = PAIRS[char];
    
    if (!closeChar) return null;

    // If there's a selection, wrap it
    if (selectionStart !== selectionEnd) {
      const before = code.substring(0, selectionStart);
      const selected = code.substring(selectionStart, selectionEnd);
      const after = code.substring(selectionEnd);
      
      return {
        newCode: before + char + selected + closeChar + after,
        newCursorPos: selectionEnd + 1
      };
    }

    // For quotes, check if we should skip closing
    if (char === '"' || char === "'" || char === '`') {
      // If next character is the same quote, just move cursor
      if (code[selectionStart] === char) {
        return {
          newCode: code,
          newCursorPos: selectionStart + 1,
          skipInsertion: true
        };
      }
      
      // Don't auto-close if we're in the middle of a word
      const afterChar = code[selectionStart];
      if (afterChar && /[a-zA-Z0-9_]/.test(afterChar)) {
        return null;
      }
    }

    // Insert character and its closing pair
    const before = code.substring(0, selectionStart);
    const after = code.substring(selectionStart);
    
    return {
      newCode: before + char + closeChar + after,
      newCursorPos: selectionStart + 1
    };
  }, []);

  /**
   * Handle smart backspace (delete matching pairs)
   * 
   * @param {string} code - Current code
   * @param {number} cursorPos - Cursor position
   * @returns {Object|null} - {newCode, newCursorPos} or null
   */
  const handleSmartBackspace = useCallback((code, cursorPos) => {
    if (cursorPos === 0) return null;

    const before = code[cursorPos - 1];
    const after = code[cursorPos];

    // Check if we're between matching pairs
    if (PAIRS[before] && PAIRS[before] === after) {
      // Delete both characters
      const newCode = code.substring(0, cursorPos - 1) + code.substring(cursorPos + 1);
      return {
        newCode,
        newCursorPos: cursorPos - 1
      };
    }

    return null;
  }, []);

  /**
   * Handle auto-indentation on Enter key
   * 
   * @param {string} code - Current code
   * @param {number} cursorPos - Cursor position
   * @returns {Object} - {newCode, newCursorPos}
   */
  const handleEnterKey = useCallback((code, cursorPos) => {
    const currentIndent = getCurrentIndentation(code, cursorPos);
    const charBefore = code[cursorPos - 1];
    const charAfter = code[cursorPos];

    // Check if we're between opening and closing brackets
    const isBetweenBrackets = 
      OPENING_BRACKETS.includes(charBefore) && 
      CLOSING_BRACKETS.includes(charAfter);

    if (isBetweenBrackets) {
      // Add extra line between brackets with increased indentation
      const extraIndent = INDENT_STRING;
      const newCode = 
        code.substring(0, cursorPos) +
        '\n' + currentIndent + extraIndent +
        '\n' + currentIndent +
        code.substring(cursorPos);
      
      return {
        newCode,
        newCursorPos: cursorPos + 1 + currentIndent.length + extraIndent.length
      };
    }

    // Determine if we need extra indentation
    const extraIndentation = OPENING_BRACKETS.includes(charBefore) ? INDENT_STRING : '';

    const newCode = 
      code.substring(0, cursorPos) +
      '\n' + currentIndent + extraIndentation +
      code.substring(cursorPos);

    return {
      newCode,
      newCursorPos: cursorPos + 1 + currentIndent.length + extraIndentation.length
    };
  }, [getCurrentIndentation]);

  /**
   * Handle Tab key (indent)
   * 
   * @param {string} code - Current code
   * @param {number} selectionStart - Selection start
   * @param {number} selectionEnd - Selection end
   * @returns {Object} - {newCode, newSelectionStart, newSelectionEnd}
   */
  const handleTab = useCallback((code, selectionStart, selectionEnd) => {
    // No selection - insert spaces
    if (selectionStart === selectionEnd) {
      const before = code.substring(0, selectionStart);
      const after = code.substring(selectionStart);
      
      return {
        newCode: before + INDENT_STRING + after,
        newSelectionStart: selectionStart + INDENT_SIZE,
        newSelectionEnd: selectionStart + INDENT_SIZE
      };
    }

    // Has selection - indent all selected lines
    const beforeSelection = code.substring(0, selectionStart);
    const selectedText = code.substring(selectionStart, selectionEnd);
    const afterSelection = code.substring(selectionEnd);

    // Find start of first selected line
    const lineStart = beforeSelection.lastIndexOf('\n') + 1;
    const fullSelectionStart = lineStart;

    // Get text from line start to selection end
    const textToIndent = code.substring(fullSelectionStart, selectionEnd);
    
    // Indent each line
    const indentedText = textToIndent
      .split('\n')
      .map(line => INDENT_STRING + line)
      .join('\n');

    const newCode = 
      code.substring(0, fullSelectionStart) +
      indentedText +
      afterSelection;

    // Calculate new selection positions
    const linesIndented = textToIndent.split('\n').length;
    const addedChars = linesIndented * INDENT_SIZE;

    return {
      newCode,
      newSelectionStart: selectionStart + INDENT_SIZE,
      newSelectionEnd: selectionEnd + addedChars
    };
  }, []);

  /**
   * Handle Shift+Tab (outdent)
   * 
   * @param {string} code - Current code
   * @param {number} selectionStart - Selection start
   * @param {number} selectionEnd - Selection end
   * @returns {Object} - {newCode, newSelectionStart, newSelectionEnd}
   */
  const handleShiftTab = useCallback((code, selectionStart, selectionEnd) => {
    const beforeSelection = code.substring(0, selectionStart);
    const selectedText = code.substring(selectionStart, selectionEnd);
    const afterSelection = code.substring(selectionEnd);

    // Find start of first selected line
    const lineStart = beforeSelection.lastIndexOf('\n') + 1;
    const fullSelectionStart = lineStart;

    // Get text from line start to selection end
    const textToOutdent = code.substring(fullSelectionStart, selectionEnd);
    
    // Outdent each line (remove up to INDENT_SIZE spaces)
    let removedChars = 0;
    const outdentedText = textToOutdent
      .split('\n')
      .map(line => {
        const match = line.match(/^(\s+)/);
        if (match && match[1].length >= INDENT_SIZE) {
          removedChars += INDENT_SIZE;
          return line.substring(INDENT_SIZE);
        } else if (match) {
          removedChars += match[1].length;
          return line.substring(match[1].length);
        }
        return line;
      })
      .join('\n');

    const newCode = 
      code.substring(0, fullSelectionStart) +
      outdentedText +
      afterSelection;

    // Calculate new selection positions
    const firstLineRemoved = Math.min(
      INDENT_SIZE,
      (code.substring(lineStart, selectionStart).match(/^\s+/) || [''])[0].length
    );

    return {
      newCode,
      newSelectionStart: Math.max(lineStart, selectionStart - firstLineRemoved),
      newSelectionEnd: Math.max(lineStart, selectionEnd - removedChars)
    };
  }, []);

  return {
    handleAutoClose,
    handleSmartBackspace,
    handleEnterKey,
    handleTab,
    handleShiftTab,
    getCurrentIndentation
  };
};

export default useAutoComplete;
