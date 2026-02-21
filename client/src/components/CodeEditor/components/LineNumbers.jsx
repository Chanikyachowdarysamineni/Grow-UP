/**
 * LineNumbers.jsx
 * ===============
 * Line numbers component with virtual rendering
 * 
 * Features:
 * - Virtual rendering for large files (10,000+ lines)
 * - Active line highlighting
 * - Scroll synchronization
 * - Memoized for performance
 */

import React, { useMemo, memo } from 'react';

/**
 * LineNumbers Component
 * 
 * @param {Object} props
 * @param {number} props.lineCount - Total number of lines
 * @param {number} props.activeLine - Current active line (1-indexed)
 * @param {number} props.scrollTop - Scroll position
 * @param {number} props.containerHeight - Visible container height
 * @param {number} props.lineHeight - Height of each line in pixels
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
const LineNumbers = ({
  lineCount,
  activeLine = 1,
  scrollTop = 0,
  containerHeight = 600,
  lineHeight = 20,
  className = '',
  style = {}
}) => {
  /**
   * Calculate visible line range for virtual rendering
   * Only render lines that are currently visible in the viewport
   */
  const visibleRange = useMemo(() => {
    // Add buffer above and below for smooth scrolling
    const bufferLines = 10;
    
    const firstVisibleLine = Math.max(1, Math.floor(scrollTop / lineHeight) - bufferLines);
    const lastVisibleLine = Math.min(
      lineCount,
      Math.ceil((scrollTop + containerHeight) / lineHeight) + bufferLines
    );

    return { firstVisibleLine, lastVisibleLine };
  }, [scrollTop, containerHeight, lineHeight, lineCount]);

  /**
   * Generate line number elements
   * Only generates visible lines for performance
   */
  const lineElements = useMemo(() => {
    const { firstVisibleLine, lastVisibleLine } = visibleRange;
    const elements = [];

    for (let i = firstVisibleLine; i <= lastVisibleLine; i++) {
      const isActive = i === activeLine;
      
      elements.push(
        <div
          key={i}
          className={`line-number ${isActive ? 'active' : ''}`}
          data-line={i}
          style={{
            height: `${lineHeight}px`,
            lineHeight: `${lineHeight}px`,
            position: 'absolute',
            top: `${(i - 1) * lineHeight}px`,
            left: 0,
            right: 0,
            textAlign: 'right',
            paddingRight: '10px',
            userSelect: 'none',
            color: isActive ? '#fff' : '#858585',
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            fontWeight: isActive ? '600' : '400',
            transition: 'all 0.15s ease'
          }}
        >
          {i}
        </div>
      );
    }

    return elements;
  }, [visibleRange, activeLine, lineHeight]);

  /**
   * Total height for scroll container
   */
  const totalHeight = lineCount * lineHeight;

  return (
    <div
      className={`line-numbers-container ${className}`}
      style={{
        position: 'relative',
        width: '50px',
        height: `${totalHeight}px`,
        backgroundColor: '#1e1e1e',
        borderRight: '1px solid #333',
        fontSize: '13px',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        overflow: 'hidden',
        flexShrink: 0,
        ...style
      }}
    >
      {lineElements}
    </div>
  );
};

/**
 * Memoized export to prevent unnecessary re-renders
 * Only re-renders when props actually change
 */
export default memo(LineNumbers, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.lineCount === nextProps.lineCount &&
    prevProps.activeLine === nextProps.activeLine &&
    prevProps.scrollTop === nextProps.scrollTop &&
    prevProps.containerHeight === nextProps.containerHeight &&
    prevProps.lineHeight === nextProps.lineHeight
  );
});
