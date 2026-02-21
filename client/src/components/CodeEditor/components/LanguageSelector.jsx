/**
 * LanguageSelector Component
 * Dropdown to select programming language
 */

import React from 'react';
import { languages } from '../languages';

const LanguageSelector = ({ 
  currentLanguage = 'javascript', 
  onLanguageChange = () => {},
  showLabel = true 
}) => {
  const languageList = Object.values(languages).map(lang => ({
    name: lang.name,
    displayName: lang.name.charAt(0).toUpperCase() + lang.name.slice(1)
  }));

  return (
    <div className="language-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {showLabel && (
        <label htmlFor="language-select" style={{ fontSize: '14px', fontWeight: '500' }}>
          Language:
        </label>
      )}
      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          border: '1px solid #555',
          backgroundColor: '#2d2d2d',
          color: '#e8e8e8',
          fontFamily: '"Segoe UI", Tahoma, sans-serif',
          fontSize: '14px',
          cursor: 'pointer',
          minWidth: '150px'
        }}
      >
        {languageList.map(lang => (
          <option key={lang.name} value={lang.name}>
            {lang.displayName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
