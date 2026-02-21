/**
 * ThemeSwitcher Component
 * Toggle between dark and light themes
 */

import React from 'react';

const ThemeSwitcher = ({ 
  currentTheme = 'dark', 
  onThemeChange = () => {},
  showLabel = false 
}) => {
  const isDark = currentTheme === 'dark';

  return (
    <div 
      className="theme-switcher"
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      {showLabel && (
        <label style={{ fontSize: '14px', fontWeight: '500' }}>
          Theme:
        </label>
      )}
      <button
        onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          border: '1px solid #555',
          backgroundColor: isDark ? '#3c3c3c' : '#f0f0f0',
          color: isDark ? '#e8e8e8' : '#333',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = isDark ? '#4c4c4c' : '#e0e0e0';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = isDark ? '#3c3c3c' : '#f0f0f0';
        }}
      >
        {isDark ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
