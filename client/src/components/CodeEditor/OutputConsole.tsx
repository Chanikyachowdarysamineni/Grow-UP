import React from 'react';

interface ExecutionResult {
  output: string;
  error: string;
  executionTime?: number;
  memoryUsage?: number;
}

interface OutputConsoleProps {
  result: ExecutionResult | null;
  input: string;
  onInputChange: (input: string) => void;
  onClear: () => void;
  onClose: () => void;
}

const OutputConsole: React.FC<OutputConsoleProps> = ({
  result,
  input,
  onInputChange,
  onClear,
  onClose,
}) => {
  return (
    <div className="output-console">
      <div className="console-header">
        <div className="console-tabs">
          <button className="console-tab active">
            📟 Output
          </button>
          <button className="console-tab">
            🐛 Debug
          </button>
        </div>
        <div className="console-actions">
          {result && (
            <span className="execution-info">
              {result.executionTime !== undefined && (
                <span className="exec-time">⏱️ {result.executionTime}ms</span>
              )}
              {result.memoryUsage && (
                <span className="exec-memory">💾 {result.memoryUsage}KB</span>
              )}
            </span>
          )}
          <button
            className="console-action-btn"
            onClick={onClear}
            title="Clear Console"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="console-body">
        {result ? (
          <>
            {result.output && (
              <div className="console-output">
                <div className="output-label">Output:</div>
                <pre className="output-text">{result.output}</pre>
              </div>
            )}
            {result.error && (
              <div className="console-error">
                <div className="error-label">❌ Error:</div>
                <pre className="error-text">{result.error}</pre>
              </div>
            )}
            {!result.output && !result.error && (
              <div className="console-empty">
                <p>✅ Program executed successfully with no output.</p>
              </div>
            )}
          </>
        ) : (
          <div className="console-empty">
            <p>Press the <strong>Run</strong> button to execute your code.</p>
            <p className="console-hint">💡 Tip: Output and errors will appear here</p>
          </div>
        )}
      </div>

      <div className="console-input-section">
        <label className="input-label">📝 Program Input (stdin):</label>
        <textarea
          className="console-input"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter input for your program (optional)..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default OutputConsole;