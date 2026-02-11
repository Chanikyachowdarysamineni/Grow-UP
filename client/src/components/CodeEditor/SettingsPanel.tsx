import React from 'react';

interface SettingsPanelProps {
  theme: 'vs-dark' | 'light';
  onThemeChange: (theme: 'vs-dark' | 'light') => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  autoSave: boolean;
  onAutoSaveChange: (enabled: boolean) => void;
  wordWrap: boolean;
  onWordWrapChange: (enabled: boolean) => void;
  minimap: boolean;
  onMinimapChange: (enabled: boolean) => void;
  lineNumbers: boolean;
  onLineNumbersChange: (enabled: boolean) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  autoSave,
  onAutoSaveChange,
  wordWrap,
  onWordWrapChange,
  minimap,
  onMinimapChange,
  lineNumbers,
  onLineNumbersChange,
  onClose,
}) => {
  const shortcuts = [
    { keys: 'Ctrl + S', action: 'Save file' },
    { keys: 'Ctrl + Enter', action: 'Run code' },
    { keys: 'Shift + Alt + F', action: 'Format code' },
    { keys: 'Ctrl + F', action: 'Find' },
    { keys: 'Ctrl + H', action: 'Find and Replace' },
    { keys: 'Ctrl + G', action: 'Go to Line' },
    { keys: 'Ctrl + /', action: 'Toggle Line Comment' },
    { keys: 'Shift + Alt + A', action: 'Toggle Block Comment' },
    { keys: 'F1', action: 'Command Palette' },
    { keys: 'F2', action: 'Rename Symbol' },
    { keys: 'F12', action: 'Go to Definition' },
    { keys: 'Alt + F12', action: 'Peek Definition' },
    { keys: 'Shift + F12', action: 'Find All References' },
    { keys: 'Alt + Up/Down', action: 'Move Line Up/Down' },
    { keys: 'Shift + Alt + Up/Down', action: 'Copy Line Up/Down' },
    { keys: 'Ctrl + Shift + K', action: 'Delete Line' },
    { keys: 'Ctrl + D', action: 'Select Next Occurrence' },
    { keys: 'Ctrl + Shift + L', action: 'Select All Occurrences' },
    { keys: 'Alt + Click', action: 'Insert Cursor' },
    { keys: 'Ctrl + Space', action: 'Trigger Suggestions' },
    { keys: 'Ctrl + Shift + Space', action: 'Parameter Hints' },
    { keys: 'Ctrl + .', action: 'Quick Fix' },
    { keys: 'Ctrl + U', action: 'Transform to Lowercase' },
    { keys: 'Ctrl + Shift + U', action: 'Transform to Uppercase' },
    { keys: 'Ctrl + Shift + Enter', action: 'Insert Line Above' },
    { keys: 'Ctrl + Shift + \\', action: 'Jump to Matching Bracket' },
    { keys: 'F11', action: 'Toggle Fullscreen' },
  ];

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Editor Settings</h2>
          <button className="settings-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-body">
          <div className="settings-section">
            <h3>Appearance</h3>
            
            <div className="setting-item">
              <label>Theme</label>
              <div className="theme-options">
                <button
                  className={`theme-btn ${theme === 'vs-dark' ? 'active' : ''}`}
                  onClick={() => onThemeChange('vs-dark')}
                >
                  🌙 Dark
                </button>
                <button
                  className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => onThemeChange('light')}
                >
                  ☀️ Light
                </button>
              </div>
            </div>

            <div className="setting-item">
              <label>Font Size: {fontSize}px</label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="slider"
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>Editor Behavior</h3>
            
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => onAutoSaveChange(e.target.checked)}
                />
                <span>Enable Auto-Save</span>
              </label>
              <p className="setting-description">
                Automatically save your files every few seconds
              </p>
            </div>

            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={wordWrap}
                  onChange={(e) => onWordWrapChange(e.target.checked)}
                />
                <span>Word Wrap</span>
              </label>
              <p className="setting-description">
                Wrap long lines to fit the editor width
              </p>
            </div>

            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={minimap}
                  onChange={(e) => onMinimapChange(e.target.checked)}
                />
                <span>Show Minimap</span>
              </label>
              <p className="setting-description">
                Display minimap for code overview
              </p>
            </div>

            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={lineNumbers}
                  onChange={(e) => onLineNumbersChange(e.target.checked)}
                />
                <span>Show Line Numbers</span>
              </label>
              <p className="setting-description">
                Display line numbers in the editor
              </p>
            </div>
          </div>

          <div className="settings-section">
            <h3>Keyboard Shortcuts</h3>
            <div className="shortcuts-list">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="shortcut-item">
                  <kbd className="shortcut-keys">{shortcut.keys}</kbd>
                  <span className="shortcut-action">{shortcut.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;