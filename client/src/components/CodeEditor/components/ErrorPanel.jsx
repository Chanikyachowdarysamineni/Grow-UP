/**
 * ErrorPanel Component
 * Displays errors and warnings from linting
 */

import React, { useState } from 'react';

const ErrorPanel = ({ 
  errors = [], 
  warnings = [],
  isOpen = false,
  onToggle = () => {}
}) => {
  const totalIssues = errors.length + warnings.length;

  if (totalIssues === 0 && isOpen === false) {
    return null;
  }

  return (
    <div className="error-panel" style={{
      borderTop: '1px solid #444',
      backgroundColor: '#1e1e1e',
      maxHeight: isOpen ? '300px' : '0',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease',
      fontSize: '13px'
    }}>
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          padding: '8px 12px',
          backgroundColor: '#252526',
          borderBottom: '1px solid #444',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        <span>
          <span style={{ color: '#f48771', marginRight: '8px' }}>
            ●  {errors.length} error{errors.length !== 1 ? 's' : ''}
          </span>
          <span style={{ color: '#dcdcaa', marginRight: '8px' }}>
            ●  {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
          </span>
        </span>
        <span style={{ color: '#888' }}>{isOpen ? '▼' : '▶'}</span>
      </div>

      {/* Issues List */}
      {isOpen && (
        <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
          {/* Errors */}
          {errors.map((error, idx) => (
            <div
              key={`error-${idx}`}
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #2d2d2d',
                borderLeft: '3px solid #f48771',
                backgroundColor: '#2d1f1f'
              }}
            >
              <div style={{ color: '#f48771', fontWeight: 'bold', marginBottom: '4px' }}>
                Error at line {error.line || '?'}, column {error.column || '?'}
              </div>
              <div style={{ color: '#ccc' }}>{error.message || error.text}</div>
            </div>
          ))}

          {/* Warnings */}
          {warnings.map((warning, idx) => (
            <div
              key={`warning-${idx}`}
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #2d2d2d',
                borderLeft: '3px solid #dcdcaa',
                backgroundColor: '#2d2a1f'
              }}
            >
              <div style={{ color: '#dcdcaa', fontWeight: 'bold', marginBottom: '4px' }}>
                Warning at line {warning.line || '?'}, column {warning.column || '?'}
              </div>
              <div style={{ color: '#ccc' }}>{warning.message || warning.text}</div>
            </div>
          ))}

          {totalIssues === 0 && (
            <div style={{ padding: '12px', color: '#888', textAlign: 'center' }}>
              No issues found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorPanel;
