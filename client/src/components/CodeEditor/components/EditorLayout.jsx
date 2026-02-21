/**
 * EditorLayout.jsx
 * ================
 * Main editor layout component
 * 
 * Features:
 * - Three-layer architecture (line numbers + syntax highlighting + textarea)
 * - Scroll synchronization
 * - Undo/redo management
 * - Auto-complete integration
 * - File management integration
 * - Performance optimized with memoization
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import LineNumbers from './LineNumbers';
import TextAreaEditor from './TextAreaEditor';
import { highlightCodeCached } from '../utils/SyntaxHighlighter';
import useUndoRedo from '../hooks/useUndoRedo';

/**
 * EditorLayout Component
 * 
 * @param {Object} props
 * @param {string} props.initialCode - Initial code content
 * @param {string} props.language - Programming language (javascript, python, etc.)
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onSave - Save handler
 * @param {boolean} props.readOnly - Read-only mode
 * @param {number} props.lineHeight - Height of each line in pixels
 * @param {Object} props.style - Additional inline styles
 * @param {string} props.className - Additional CSS classes
 */
const EditorLayout = ({
  initialCode = '',
  language = 'javascript',
  onChange,
  onSave,
  readOnly = false,
  lineHeight = 20,
  style = {},
  className = ''
}) => {
  // Container ref for scroll sync
  const containerRef = useRef(null);
  const syntaxLayerRef = useRef(null);
  const lineNumbersContainerRef = useRef(null);
  const textareaEditorRef = useRef(null);

  // Scroll state
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  // Cursor state
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });

  // Undo/Redo hook
  const {
    currentState,
    canUndo,
    canRedo,
    undo,
    redo,
    addToHistory
  } = useUndoRedo(initialCode, cursorPosition);

  // Current code
  const [code, setCode] = useState(currentState.code);

  /**
   * Sync code with undo/redo state
   */
  useEffect(() => {
    setCode(currentState.code);
    
    // Restore cursor position
    if (textareaEditorRef.current) {
      const { start, end } = currentState.cursorPosition;
      textareaEditorRef.current.setSelection(start, end);
    }
  }, [currentState]);

  /**
   * Calculate line count
   */
  const lineCount = useMemo(() => {
    return code.split('\n').length;
  }, [code]);

  /**
   * Calculate active line from cursor position
   */
  const activeLine = useMemo(() => {
    const beforeCursor = code.substring(0, cursorPosition.start);
    return beforeCursor.split('\n').length;
  }, [code, cursorPosition.start]);

  /**
   * Generate highlighted code HTML
   */
  const highlightedCode = useMemo(() => {
    return highlightCodeCached(code, language);
  }, [code, language]);

  /**
   * Handle code change
   */
  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    
    // Add to history (debounced in hook)
    addToHistory(newCode, cursorPosition);
    
    // Notify parent
    onChange?.(newCode);
  }, [addToHistory, cursorPosition, onChange]);

  /**
   * Handle undo
   */
  const handleUndo = useCallback(() => {
    if (canUndo) {
      undo();
    }
  }, [canUndo, undo]);

  /**
   * Handle redo
   */
  const handleRedo = useCallback(() => {
    if (canRedo) {
      redo();
    }
  }, [canRedo, redo]);

  /**
   * Handle save
   */
  const handleSave = useCallback(() => {
    onSave?.(code);
  }, [code, onSave]);

  /**
   * Handle cursor position change
   */
  const handleCursorChange = useCallback((position) => {
    setCursorPosition(position);
  }, []);

  /**
   * Scroll synchronization
   */
  const handleScroll = useCallback((e) => {
    const target = e.target;
    const newScrollTop = target.scrollTop;
    const newScrollLeft = target.scrollLeft;

    setScrollTop(newScrollTop);
    setScrollLeft(newScrollLeft);

    // Sync line numbers container
    if (lineNumbersContainerRef.current) {
      lineNumbersContainerRef.current.scrollTop = newScrollTop;
    }

    // Sync syntax layer
    if (syntaxLayerRef.current) {
      syntaxLayerRef.current.scrollTop = newScrollTop;
      syntaxLayerRef.current.scrollLeft = newScrollLeft;
    }
  }, []);

  /**
   * Listen to scroll events from textarea
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleEditorScroll = (e) => {
      handleScroll({ target: e.detail || e.target });
    };

    container.addEventListener('editorScroll', handleEditorScroll);
    
    return () => {
      container.removeEventListener('editorScroll', handleEditorScroll);
    };
  }, [handleScroll]);

  /**
   * Update container height on resize
   */
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`code-editor-layout ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
        overflow: 'hidden',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: '14px',
        ...style
      }}
    >
      {/* Line Numbers Layer */}
      <div
        ref={lineNumbersContainerRef}
        style={{
          position: 'relative',
          width: '50px',
          height: '100%',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <LineNumbers
          lineCount={lineCount}
          activeLine={activeLine}
          scrollTop={scrollTop}
          containerHeight={containerHeight}
          lineHeight={lineHeight}
        />
      </div>

      {/* Code Layers Container */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Syntax Highlighting Layer */}
        <div
          ref={syntaxLayerRef}
          className="syntax-layer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            padding: '10px',
            margin: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '14px',
            lineHeight: `${lineHeight}px`,
            whiteSpace: 'pre',
            wordWrap: 'normal',
            color: '#d4d4d4'
          }}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />

        {/* Textarea Layer */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          onScroll={handleScroll}
        >
          <TextAreaEditor
            ref={textareaEditorRef}
            value={code}
            onChange={handleCodeChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSave={handleSave}
            onCursorChange={handleCursorChange}
            readOnly={readOnly}
            lineHeight={lineHeight}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
