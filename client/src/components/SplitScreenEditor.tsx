import React, { useState } from 'react';
import CustomCodeEditor from './CustomCodeEditor';
import './SplitScreenEditor.css';

interface SplitScreenEditorProps {
  leftFile: { filename: string; content: string; language: string } | null;
  rightFile: { filename: string; content: string; language: string } | null;
  onLeftChange: (content: string) => void;
  onRightChange: (content: string) => void;
  theme?: 'light' | 'dark';
  onSaveLeft?: () => void;
  onSaveRight?: () => void;
}

type LayoutMode = 'horizontal' | 'vertical';

const SplitScreenEditor: React.FC<SplitScreenEditorProps> = ({
  leftFile,
  rightFile,
  onLeftChange,
  onRightChange,
  theme = 'dark',
  onSaveLeft,
  onSaveRight
}) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('horizontal');
  const [leftPanelSize, setLeftPanelSize] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();

    if (layoutMode === 'horizontal') {
      const newSize = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftPanelSize(Math.min(Math.max(newSize, 20), 80));
    } else {
      const newSize = ((e.clientY - rect.top) / rect.height) * 100;
      setLeftPanelSize(Math.min(Math.max(newSize, 20), 80));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={`split-screen-container ${theme}`}>
      {/* Control Bar */}
      <div className="split-control-bar">
        <div className="split-info">
          <span className="split-label">Split View</span>
          {leftFile && <span className="file-label">Left: {leftFile.filename}</span>}
          {rightFile && <span className="file-label">Right: {rightFile.filename}</span>}
        </div>
        <div className="split-controls">
          <button
            className={`layout-btn ${layoutMode === 'horizontal' ? 'active' : ''}`}
            onClick={() => setLayoutMode('horizontal')}
            title="Horizontal split"
          >
            ⬌
          </button>
          <button
            className={`layout-btn ${layoutMode === 'vertical' ? 'active' : ''}`}
            onClick={() => setLayoutMode('vertical')}
            title="Vertical split"
          >
            ⬍
          </button>
          <button
            className="reset-btn"
            onClick={() => setLeftPanelSize(50)}
            title="Reset split to 50/50"
          >
            ⚌
          </button>
        </div>
      </div>

      {/* Editors */}
      <div
        className={`split-editors ${layoutMode}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Left Panel */}
        <div
          className="editor-panel left-panel"
          style={{
            [layoutMode === 'horizontal' ? 'width' : 'height']: `${leftPanelSize}%`
          }}
        >
          {leftFile ? (
            <CustomCodeEditor
              value={leftFile.content}
              onChange={onLeftChange}
              language={leftFile.language}
              theme={theme}
              onSave={onSaveLeft}
              filename={leftFile.filename}
            />
          ) : (
            <div className="empty-panel">
              <p>No file selected for left panel</p>
              <p className="hint">Select a file from the tabs above</p>
            </div>
          )}
        </div>

        {/* Resizer */}
        <div
          className={`resizer ${layoutMode} ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className="resizer-handle"></div>
        </div>

        {/* Right Panel */}
        <div
          className="editor-panel right-panel"
          style={{
            [layoutMode === 'horizontal' ? 'width' : 'height']: `${100 - leftPanelSize}%`
          }}
        >
          {rightFile ? (
            <CustomCodeEditor
              value={rightFile.content}
              onChange={onRightChange}
              language={rightFile.language}
              theme={theme}
              onSave={onSaveRight}
              filename={rightFile.filename}
            />
          ) : (
            <div className="empty-panel">
              <p>No file selected for right panel</p>
              <p className="hint">Select a file from the tabs above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitScreenEditor;
