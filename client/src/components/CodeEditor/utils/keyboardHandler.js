/**
 * Custom Keyboard Handler
 * Handles editor-specific keyboard shortcuts and events
 */

export const keyboardHandler = {
  // Check modifier key combinations
  hasCtrl(event) {
    return event.ctrlKey || event.metaKey;
  },

  hasShift(event) {
    return event.shiftKey;
  },

  hasAlt(event) {
    return event.altKey;
  },

  // Get key name
  getKeyName(event) {
    return event.key;
  },

  // Check for specific keyboard shortcuts
  isCtrlS(event) {
    return this.hasCtrl(event) && event.key === 's';
  },

  isCtrlZ(event) {
    return this.hasCtrl(event) && event.key === 'z';
  },

  isCtrlY(event) {
    return this.hasCtrl(event) && event.key === 'y';
  },

  isCtrlA(event) {
    return this.hasCtrl(event) && event.key === 'a';
  },

  isCtrlC(event) {
    return this.hasCtrl(event) && event.key === 'c';
  },

  isCtrlV(event) {
    return this.hasCtrl(event) && event.key === 'v';
  },

  isCtrlX(event) {
    return this.hasCtrl(event) && event.key === 'x';
  },

  isCtrlF(event) {
    return this.hasCtrl(event) && event.key === 'f';
  },

  isCtrlH(event) {
    return this.hasCtrl(event) && event.key === 'h';
  },

  isTab(event) {
    return event.key === 'Tab';
  },

  isEnter(event) {
    return event.key === 'Enter';
  },

  isBackspace(event) {
    return event.key === 'Backspace';
  },

  isDelete(event) {
    return event.key === 'Delete';
  },

  isArrowUp(event) {
    return event.key === 'ArrowUp';
  },

  isArrowDown(event) {
    return event.key === 'ArrowDown';
  },

  isArrowLeft(event) {
    return event.key === 'ArrowLeft';
  },

  isArrowRight(event) {
    return event.key === 'ArrowRight';
  },

  isEscape(event) {
    return event.key === 'Escape';
  },

  // Get cursor position in textarea
  getCursorPosition(textarea) {
    return textarea.selectionStart;
  },

  // Get selection range
  getSelectionRange(textarea) {
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    };
  },

  // Check if text is selected
  hasSelection(textarea) {
    return textarea.selectionStart !== textarea.selectionEnd;
  },

  // Get selected text
  getSelectedText(textarea) {
    return textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
  },

  // Insert text at cursor position
  insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    textarea.value = before + text + after;
    textarea.selectionStart = start + text.length;
    textarea.selectionEnd = start + text.length;
  },

  // Replace selected text
  replaceSelection(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    textarea.value = before + text + after;
    textarea.selectionStart = start + text.length;
    textarea.selectionEnd = start + text.length;
  },

  // Get current line
  getCurrentLine(textarea) {
    const start = textarea.selectionStart;
    const value = textarea.value;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start);
    const endPos = lineEnd === -1 ? value.length : lineEnd;
    return value.substring(lineStart, endPos);
  },

  // Get line number from cursor position
  getLineNumber(textarea) {
    return textarea.value.substring(0, textarea.selectionStart).split('\n').length;
  },

  // Get column number from cursor position
  getColumnNumber(textarea) {
    const start = textarea.selectionStart;
    const value = textarea.value;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    return start - lineStart;
  },

  // Insert indentation (spaces or tab)
  insertIndentation(textarea, indentSize = 2, useSpaces = true) {
    const indent = useSpaces ? ' '.repeat(indentSize) : '\t';
    this.insertAtCursor(textarea, indent);
  },

  // Delete word backwards
  deleteWordBackwards(textarea) {
    const start = textarea.selectionStart;
    if (start === 0) return;

    let deleteStart = start;
    const value = textarea.value;

    // Skip whitespace
    while (deleteStart > 0 && /\s/.test(value[deleteStart - 1])) {
      deleteStart--;
    }

    // Delete word characters
    while (deleteStart > 0 && /\w/.test(value[deleteStart - 1])) {
      deleteStart--;
    }

    textarea.value = value.substring(0, deleteStart) + value.substring(start);
    textarea.selectionStart = deleteStart;
    textarea.selectionEnd = deleteStart;
  },

  // Delete word forwards
  deleteWordForwards(textarea) {
    const start = textarea.selectionStart;
    const value = textarea.value;
    if (start === value.length) return;

    let deleteEnd = start;

    // Skip whitespace
    while (deleteEnd < value.length && /\s/.test(value[deleteEnd])) {
      deleteEnd++;
    }

    // Delete word characters
    while (deleteEnd < value.length && /\w/.test(value[deleteEnd])) {
      deleteEnd++;
    }

    textarea.value = value.substring(0, start) + value.substring(deleteEnd);
    textarea.selectionStart = start;
    textarea.selectionEnd = start;
  },

  // Select line
  selectLine(textarea) {
    const start = textarea.selectionStart;
    const value = textarea.value;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start);
    const endPos = lineEnd === -1 ? value.length : lineEnd;
    
    textarea.selectionStart = lineStart;
    textarea.selectionEnd = endPos;
  }
};

export default keyboardHandler;
