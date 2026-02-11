import React from 'react';

interface File {
  id: string;
  name: string;
  language: string;
  content: string;
  lastModified: Date;
}

interface FileExplorerProps {
  files: File[];
  activeFileId: string;
  onFileSelect: (id: string) => void;
  onFileCreate: () => void;
  onFileDelete: (id: string) => void;
  onFileRename: (id: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
}) => {
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const icons: Record<string, string> = {
      py: '🐍',
      java: '☕',
      c: '©️',
      cpp: '➕',
      go: '🔷',
    };
    return icons[ext || ''] || '📄';
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>📁 Files</h3>
        <button className="btn-create-file" onClick={onFileCreate} title="Create New File">
          +
        </button>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.id === activeFileId ? 'active' : ''}`}
            onClick={() => onFileSelect(file.id)}
          >
            <span className="file-icon">{getFileIcon(file.name)}</span>
            <span className="file-name">{file.name}</span>
            <div className="file-actions">
              <button
                className="btn-file-action"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRename(file.id);
                }}
                title="Rename"
              >
                ✏️
              </button>
              <button
                className="btn-file-action"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileDelete(file.id);
                }}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;