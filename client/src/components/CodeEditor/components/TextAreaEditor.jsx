/**
 * TextAreaEditor.jsx
 * ==================
 * Textarea component with advanced editing features
 * 
 * Features:
 * - Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S, etc.)
 * - Auto-complete integration
 * - Tab/Shift+Tab handling
 * - Smart Enter key
 * - Selection management
 * - Accessibility support
 */

import React, { useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import useAutoComplete from '../hooks/useAutoComplete';

/**
 * TextAreaEditor Component
 * 
 * @param {Object} props
 * @param {string} props.value - Current code value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onUndo - Undo handler
 * @param {Function} props.onRedo - Redo handler
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onCursorChange - Cursor position change handler
 * @param {boolean} props.readOnly - Read-only mode
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {number} props.lineHeight - Line height in pixels
 */
const TextAreaEditor = forwardRef(({
  value = '',
  onChange,
  onUndo,
  onRedo,
  onSave,
  onCursorChange,
  readOnly = false,
  placeholder = 'Start coding...',
  className = '',
  style = {},
  lineHeight = 20
}, ref) => {
  const textareaRef = useRef(null);
  const {
    handleAutoClose,
    handleSmartBackspace,
    handleEnterKey,
    handleTab,
    handleShiftTab
  } = useAutoComplete();

  /**
   * Expose methods to parent via ref
   */
  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    blur: () => textareaRef.current?.blur(),
    getSelection: () => ({
      start: textareaRef.current?.selectionStart || 0,
      end: textareaRef.current?.selectionEnd || 0
    }),
    setSelection: (start, end) => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = start;
        textareaRef.current.selectionEnd = end;
      }
    },
    scrollToLine: (lineNumber) => {
      if (textareaRef.current) {
        const scrollTop = (lineNumber - 1) * lineHeight;
        textareaRef.current.scrollTop = scrollTop;
      }
    }
  }));

  /**
   * Handle text input changes
   */
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    
    // Notify cursor position change
    if (onCursorChange) {
      onCursorChange({
        start: e.target.selectionStart,
        end: e.target.selectionEnd
      });
    }
  }, [onChange, onCursorChange]);

  /**
   * Handle cursor/selection changes
   */
  const handleSelect = useCallback((e) => {
    if (onCursorChange) {
      onCursorChange({
        start: e.target.selectionStart,
        end: e.target.selectionEnd
      });
    }
  }, [onCursorChange]);

  /**
   * Handle keyboard shortcuts and special keys
   */
  const handleKeyDown = useCallback((e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const isCtrl = e.ctrlKey || e.metaKey;

    // Ctrl+Z: Undo
    if (isCtrl && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      onUndo?.();
      return;
    }

    // Ctrl+Y or Ctrl+Shift+Z: Redo
    if ((isCtrl && e.key === 'y') || (isCtrl && e.shiftKey && e.key === 'z')) {
      e.preventDefault();
      onRedo?.();
      return;
    }

    // Ctrl+S: Save
    if (isCtrl && e.key === 's') {
      e.preventDefault();
      onSave?.();
      return;
    }

    // Tab: Indent
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const result = handleTab(value, selectionStart, selectionEnd);
      
      onChange?.(result.newCode);
      
      // Set selection after React renders
      setTimeout(() => {
        textarea.selectionStart = result.newSelectionStart;
        textarea.selectionEnd = result.newSelectionEnd;
      }, 0);
      return;
    }

    // Shift+Tab: Outdent
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      const result = handleShiftTab(value, selectionStart, selectionEnd);
      
      onChange?.(result.newCode);
      
      setTimeout(() => {
        textarea.selectionStart = result.newSelectionStart;
        textarea.selectionEnd = result.newSelectionEnd;
      }, 0);
      return;
    }

    // Enter: Auto-indent
    if (e.key === 'Enter') {
      e.preventDefault();
      const result = handleEnterKey(value, selectionStart);
      
      onChange?.(result.newCode);
      
      setTimeout(() => {
        textarea.selectionStart = result.newCursorPos;
        textarea.selectionEnd = result.newCursorPos;
      }, 0);
      return;
    }

    // Backspace: Smart delete pairs
    if (e.key === 'Backspace' && selectionStart === selectionEnd) {
      const result = handleSmartBackspace(value, selectionStart);
      
      if (result) {
        e.preventDefault();
        onChange?.(result.newCode);
        
        setTimeout(() => {
          textarea.selectionStart = result.newCursorPos;
          textarea.selectionEnd = result.newCursorPos;
        }, 0);
      }
      return;
    }
  }, [value, onChange, onUndo, onRedo, onSave, handleTab, handleShiftTab, handleEnterKey, handleSmartBackspace]);

  /**
   * Handle character input for auto-complete
   */
  const handleBeforeInput = useCallback((e) => {
    // Only handle single character input
    if (e.data && e.data.length === 1) {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd } = textarea;
      const result = handleAutoClose(e.data, value, selectionStart, selectionEnd);

      if (result) {
        e.preventDefault();
        
        // Skip insertion means we just move cursor
        if (result.skipInsertion) {
          textarea.selectionStart = result.newCursorPos;
          textarea.selectionEnd = result.newCursorPos;
          return;
        }

        onChange?.(result.newCode);
        
        setTimeout(() => {
          textarea.selectionStart = result.newCursorPos;
          textarea.selectionEnd = result.newCursorPos;
        }, 0);
      }
    }
  }, [value, onChange, handleAutoClose]);

  /**
   * Sync scroll position with parent
   */
  const handleScroll = useCallback((e) => {
    // Parent can listen to this via ref if needed
    const scrollTop = e.target.scrollTop;
    const scrollLeft = e.target.scrollLeft;
    
    // Emit custom event for scroll sync
    const event = new CustomEvent('editorScroll', {
      detail: { scrollTop, scrollLeft }
    });
    e.target.dispatchEvent(event);
  }, []);

  /**
   * Auto-focus on mount
   */
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      onSelect={handleSelect}
      onKeyDown={handleKeyDown}
      onBeforeInput={handleBeforeInput}
      onScroll={handleScroll}
      readOnly={readOnly}
      placeholder={placeholder}
      spellCheck={false}
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      className={`code-textarea ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: '10px',
        margin: 0,
        border: 'none',
        outline: 'none',
        resize: 'none',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: '14px',
        lineHeight: `${lineHeight}px`,
        color: 'transparent',
        caretColor: '#fff',
        backgroundColor: 'transparent',
        whiteSpace: 'pre',
        overflowWrap: 'normal',
        overflowX: 'auto',
        overflowY: 'auto',
        tabSize: 2,
        ...style
      }}
      aria-label="Code editor"
      aria-multiline="true"
      role="textbox"
    />
  );
});

TextAreaEditor.displayName = 'TextAreaEditor';

export default TextAreaEditor;
