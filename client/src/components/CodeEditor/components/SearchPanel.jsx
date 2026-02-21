/**
 * SearchPanel Component
 * Find and replace functionality
 */

import React, { useState } from 'react';
import { searchUtils } from '../utils/searchUtils';

const SearchPanel = ({ 
  code = '',
  isOpen = false,
  onClose = () => {},
  onReplace = () => {},
  onHighlight = () => {} 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [regex, setRegex] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);

  // Update match count when search term changes
  React.useEffect(() => {
    if (searchTerm) {
      const matches = regex 
        ? searchUtils.findRegex(code, searchTerm)
        : searchUtils.findAll(code, searchTerm, caseSensitive);
      setMatchCount(matches.length);
      setCurrentMatch(matches.length > 0 ? 1 : 0);
      onHighlight(matches);
    } else {
      setMatchCount(0);
      setCurrentMatch(0);
      onHighlight([]);
    }
  }, [searchTerm, caseSensitive, regex, code, onHighlight]);

  const handleReplace = () => {
    const newCode = regex
      ? searchUtils.replaceRegex(code, searchTerm, replaceTerm)
      : searchUtils.replaceAll(code, searchTerm, replaceTerm, caseSensitive);
    onReplace(newCode);
  };

  if (!isOpen) return null;

  return (
    <div className="search-panel" style={{
      backgroundColor: '#252526',
      borderBottom: '1px solid #3e3e42',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      fontSize: '13px',
      zIndex: 100
    }}>
      {/* Search Row */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Find..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: '3px',
            border: '1px solid #555',
            backgroundColor: '#3c3c3c',
            color: '#e8e8e8',
            fontSize: '12px'
          }}
        />
        <span style={{ color: '#999', fontSize: '12px' }}>
          {matchCount > 0 ? `${currentMatch}/${matchCount}` : 'No results'}
        </span>
        <button
          onClick={onClose}
          style={{
            padding: '4px 8px',
            backgroundColor: '#3c3c3c',
            border: '1px solid #555',
            color: '#e8e8e8',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Replace Row */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Replace..."
          value={replaceTerm}
          onChange={(e) => setReplaceTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: '3px',
            border: '1px solid #555',
            backgroundColor: '#3c3c3c',
            color: '#e8e8e8',
            fontSize: '12px'
          }}
        />
        <button
          onClick={handleReplace}
          disabled={!searchTerm}
          style={{
            padding: '6px 12px',
            backgroundColor: searchTerm ? '#0e639c' : '#3c3c3c',
            border: '1px solid #555',
            color: searchTerm ? '#fff' : '#888',
            borderRadius: '3px',
            cursor: searchTerm ? 'pointer' : 'not-allowed',
            fontSize: '12px'
          }}
        >
          Replace All
        </button>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          <span>Case</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={regex}
            onChange={(e) => setRegex(e.target.checked)}
          />
          <span>Regex</span>
        </label>
      </div>
    </div>
  );
};

export default SearchPanel;
