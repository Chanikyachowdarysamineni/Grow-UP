import React from 'react';
import { languageConfigs } from './languageConfig';

interface EditorToolbarProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onRun: () => void;
  onStop: () => void;
  onSave: () => void;
  onDownload: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFormat: () => void;
  theme: 'vs-dark' | 'light';
  onThemeChange: (theme: 'vs-dark' | 'light') => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onSettings: () => void;
  onFullscreen: () => void;
  onCopyCode: () => void;
  isExecuting: boolean;
  autoSave: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  language,
  onLanguageChange,
  onRun,
  onStop,
  onSave,
  onDownload,
  onUpload,
  onFormat,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  onSettings,
  onFullscreen,
  onCopyCode,
  isExecuting,
  autoSave,
}) => {
  // Dynamically generate language options from config
  const languages = Object.entries(languageConfigs).map(([key, config]) => ({
    value: key,
    label: config.displayName,
    icon: config.icon,
    category: config.category,
  }));

  return (
    <div className="editor-toolbar">
      <div className="toolbar-left">
        <div className="toolbar-brand">
          <span className="brand-icon">💻</span>
          <span className="brand-text">Code Editor</span>
        </div>

        <select
          className="language-selector"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        <button
          className="toolbar-btn btn-run"
          onClick={onRun}
          disabled={isExecuting}
          title="Run Code (Ctrl+Enter)"
        >
          {isExecuting ? (
            <>
              <span className="spinner"></span> Running...
            </>
          ) : (
            <>
              ▶️ Run
            </>
          )}
        </button>

        {isExecuting && (
          <button
            className="toolbar-btn btn-stop"
            onClick={onStop}
            title="Stop Execution"
          >
            ⏹️ Stop
          </button>
        )}
      </div>

      <div className="toolbar-right">
        <button
          className="toolbar-btn"
          onClick={onSave}
          title="Save (Ctrl+S)"
        >
          💾 Save
        </button>

        <button
          className="toolbar-btn"
          onClick={onFormat}
          title="Format Code (Shift+Alt+F)"
        >
          ✨ Format
        </button>

        {autoSave && <span className="auto-save-indicator">✓ Auto-save</span>}

        <button
          className="toolbar-btn"
          onClick={onDownload}
          title="Download File"
        >
          ⬇️
        </button>

        <label className="toolbar-btn" title="Upload File">
          ⬆️
          <input
            type="file"
            onChange={onUpload}
            style={{ display: 'none' }}
            accept=".py,.java,.c,.cpp,.go,.txt"
          />
        </label>

        <button
          className="toolbar-btn"
          onClick={onCopyCode}
          title="Copy Code"
        >
          📋
        </button>

        <div className="toolbar-divider"></div>

        <button
          className="toolbar-btn"
          onClick={() => onFontSizeChange(Math.max(10, fontSize - 1))}
          title="Decrease Font Size"
        >
          A-
        </button>

        <span className="font-size-display">{fontSize}px</span>

        <button
          className="toolbar-btn"
          onClick={() => onFontSizeChange(Math.min(24, fontSize + 1))}
          title="Increase Font Size"
        >
          A+
        </button>

        <div className="toolbar-divider"></div>

        <button
          className="toolbar-btn"
          onClick={() => onThemeChange(theme === 'vs-dark' ? 'light' : 'vs-dark')}
          title="Toggle Theme"
        >
          {theme === 'vs-dark' ? '☀️' : '🌙'}
        </button>

        <button
          className="toolbar-btn"
          onClick={onFullscreen}
          title="Toggle Fullscreen (F11)"
        >
          ⛶
        </button>

        <button
          className="toolbar-btn"
          onClick={onSettings}
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;