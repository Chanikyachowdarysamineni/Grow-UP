/* eslint-disable no-template-curly-in-string */
import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Split from 'react-split';
import FileExplorer from './FileExplorer';
import EditorToolbar from './EditorToolbar';
import OutputConsole from './OutputConsole';
import SettingsPanel from './SettingsPanel';
import { languageTemplates, codeSnippets } from './languageConfig';
import axios from 'axios';
import './EditorPage.css';

interface File {
  id: string;
  name: string;
  language: string;
  content: string;
  lastModified: Date;
}

interface ExecutionResult {
  output: string;
  error: string;
  executionTime?: number;
  memoryUsage?: number;
}

const EditorPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([
    {
      id: '1',
      name: 'main.py',
      language: 'python',
      content: languageTemplates.python,
      lastModified: new Date(),
    },
  ]);
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [autoSave, setAutoSave] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [consoleInput, setConsoleInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [minimap, setMinimap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const editorRef = useRef<any>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const executionProcessRef = useRef<any>(null);

  const activeFile = files.find(f => f.id === activeFileId);

  useEffect(() => {
    // Load saved files from localStorage
    const savedFiles = localStorage.getItem('editorFiles');
    const savedActiveFileId = localStorage.getItem('activeFileId');
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
    if (savedActiveFileId) {
      setActiveFileId(savedActiveFileId);
    }
  }, []);

  useEffect(() => {
    // Auto-save files to localStorage
    if (autoSave && files.length > 0) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem('editorFiles', JSON.stringify(files));
        localStorage.setItem('activeFileId', activeFileId);
      }, 1000);
    }
  }, [files, activeFileId, autoSave]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Register IntelliSense for all supported languages
    Object.keys(codeSnippets).forEach((lang) => {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: () => {
          const suggestions: any[] = [];
          const snippets = codeSnippets[lang];

          // Convert snippets to Monaco completion items
          Object.entries(snippets).forEach(([label, insertText]) => {
            suggestions.push({
              label,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: `${label} snippet for ${lang}`,
            });
          });

          return { suggestions };
        },
      });
    });

    // Enable parameter hints
    editor.updateOptions({
      parameterHints: { enabled: true },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
    });

    // Add comprehensive keyboard shortcuts
    // Save file
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveFile();
    });

    // Run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });

    // Go to line
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
      editor.getAction('editor.action.gotoLine').run();
    });

    // Find
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find').run();
    });

    // Replace
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      editor.getAction('editor.action.startFindReplaceAction').run();
    });

    // Format document
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument').run();
    });

    // Command palette
    editor.addCommand(monaco.KeyCode.F1, () => {
      editor.getAction('editor.action.quickCommand').run();
    });

    // Toggle comment
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      editor.getAction('editor.action.commentLine').run();
    });

    // Go to definition
    editor.addCommand(monaco.KeyCode.F12, () => {
      editor.getAction('editor.action.revealDefinition').run();
    });

    // Find all references
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.F12, () => {
      editor.getAction('editor.action.referenceSearch.trigger').run();
    });

    // Rename symbol
    editor.addCommand(monaco.KeyCode.F2, () => {
      editor.getAction('editor.action.rename').run();
    });

    // Delete line
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK, () => {
      editor.getAction('editor.action.deleteLines').run();
    });

    // Duplicate line
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.getAction('editor.action.copyLinesDownAction').run();
    });

    // Move line up
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
      editor.getAction('editor.action.moveLinesUpAction').run();
    });

    // Move line down
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.getAction('editor.action.moveLinesDownAction').run();
    });

    // Select next occurrence (Ctrl+D)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.getAction('editor.action.addSelectionToNextFindMatch').run();
    });

    // Fullscreen toggle (F11)  
    editor.addCommand(monaco.KeyCode.F11, () => {
      toggleFullscreen();
    });

    // Duplicate line up
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
      editor.getAction('editor.action.copyLinesUpAction').run();
    });

    // Select all occurrences (Ctrl+Shift+L)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyL, () => {
      editor.getAction('editor.action.selectHighlights').run();
    });

    // Peek definition (Alt+F12)
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.F12, () => {
      editor.getAction('editor.action.peekDefinition').run();
    });

    // Quick Fix / Code actions (Ctrl+.)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Period, () => {
      editor.getAction('editor.action.quickFix').run();
    });

    // Trigger suggest (Ctrl+Space)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      editor.getAction('editor.action.triggerSuggest').run();
    });

    // Trigger parameter hints (Ctrl+Shift+Space)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Space, () => {
      editor.getAction('editor.action.triggerParameterHints').run();
    });

    // Toggle block comment (Shift+Alt+A)
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyA, () => {
      editor.getAction('editor.action.blockComment').run();
    });

    // Insert line above (Ctrl+Shift+Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      editor.getAction('editor.action.insertLineBefore').run();
    });

    // Jump to matching bracket (Ctrl+Shift+\)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Backslash, () => {
      editor.getAction('editor.action.jumpToBracket').run();
    });

    // Transform to lowercase (Ctrl+U)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyU, () => {
      editor.getAction('editor.action.transformToLowercase').run();
    });

    // Transform to uppercase (Ctrl+Shift+U)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyU, () => {
      editor.getAction('editor.action.transformToUppercase').run();
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      updateFileContent(activeFileId, value);
    }
  };

  const updateFileContent = (fileId: string, content: string) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === fileId ? { ...f, content, lastModified: new Date() } : f
      )
    );
  };

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name (e.g., main.js):');
    if (!fileName) return;

    const extension = fileName.split('.').pop()?.toLowerCase() || 'txt';
    const languageMap: Record<string, string> = {
      py: 'python',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      go: 'go',
    };
    const language = languageMap[extension] || 'python';

    const newFile: File = {
      id: Date.now().toString(),
      name: fileName,
      language,
      content: languageTemplates[language as keyof typeof languageTemplates] || '',
      lastModified: new Date(),
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleDeleteFile = (fileId: string) => {
    if (files.length === 1) {
      alert('Cannot delete the last file!');
      return;
    }
    if (window.confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      if (activeFileId === fileId) {
        setActiveFileId(files[0].id === fileId ? files[1].id : files[0].id);
      }
    }
  };

  const handleRenameFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const newName = prompt('Enter new file name:', file.name);
    if (newName && newName !== file.name) {
      setFiles(prev =>
        prev.map(f => (f.id === fileId ? { ...f, name: newName } : f))
      );
    }
  };

  const handleSaveFile = () => {
    if (!activeFile) return;
    localStorage.setItem('editorFiles', JSON.stringify(files));
    alert('File saved successfully!');
  };

  const handleDownloadFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase() || 'txt';
      const languageMap: Record<string, string> = {
        py: 'python',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        go: 'go',
      };
      const language = languageMap[extension] || 'python';

      const newFile: File = {
        id: Date.now().toString(),
        name: file.name,
        language,
        content,
        lastModified: new Date(),
      };

      setFiles(prev => [...prev, newFile]);
      setActiveFileId(newFile.id);
    };
    reader.readAsText(file);
  };

  const handleRunCode = async () => {
    if (!activeFile) return;

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const startTime = Date.now();
      
      // Call backend API to execute code
      const cancelTokenSource = axios.CancelToken.source();
      executionProcessRef.current = cancelTokenSource;

      const response = await axios.post('http://localhost:5000/api/execute', {
        language: activeFile.language,
        code: activeFile.content,
        input: consoleInput,
      }, {
        timeout: 30000, // 30 second timeout
        cancelToken: cancelTokenSource.token,
      });

      const executionTime = Date.now() - startTime;

      setExecutionResult({
        output: response.data.output || '',
        error: response.data.error || '',
        executionTime,
        memoryUsage: response.data.memoryUsage,
      });
    } catch (error: any) {
      if (axios.isCancel(error)) {
        setExecutionResult({
          output: '',
          error: '⚠️ Execution stopped by user.',
          executionTime: 0,
        });
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Execution failed. Please check if the backend server is running.';
        setExecutionResult({
          output: '',
          error: `❌ ${errorMessage}`,
          executionTime: 0,
        });
      }
    } finally {
      setIsExecuting(false);
      executionProcessRef.current = null;
    }
  };

  const handleStopExecution = () => {
    if (executionProcessRef.current) {
      executionProcessRef.current.cancel('Execution stopped by user');
      setIsExecuting(false);
    }
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const handleLanguageChange = (language: string) => {
    if (!activeFile) return;
    
    // Get the file extension for the new language
    const extensions: Record<string, string> = {
      python: '.py', java: '.java', c: '.c', cpp: '.cpp', go: '.go',
      javascript: '.js', typescript: '.ts', html: '.html', css: '.css',
      json: '.json', markdown: '.md', php: '.php', rust: '.rs',
      csharp: '.cs', kotlin: '.kt', swift: '.swift', ruby: '.rb',
      dart: '.dart', sql: '.sql', shell: '.sh', r: '.r'
    };
    
    const currentExtension = activeFile.name.substring(activeFile.name.lastIndexOf('.'));
    const newExtension = extensions[language] || currentExtension;
    const newName = activeFile.name.replace(/\.[^/.]+$/, '') + newExtension;
    
    setFiles(prev =>
      prev.map(f =>
        f.id === activeFileId
          ? { ...f, language, name: newName }
          : f
      )
    );
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleCopyCode = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      alert('Code copied to clipboard!');
    }
  };

  return (
    <div className={`editor-page ${theme} ${isFullscreen ? 'fullscreen' : ''}`}>
      <EditorToolbar
        language={activeFile?.language || 'python'}
        onLanguageChange={handleLanguageChange}
        onRun={handleRunCode}
        onStop={handleStopExecution}
        onSave={handleSaveFile}
        onDownload={handleDownloadFile}
        onUpload={handleUploadFile}
        onFormat={handleFormatCode}
        theme={theme}
        onThemeChange={setTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onSettings={() => setShowSettings(!showSettings)}
        onFullscreen={toggleFullscreen}
        onCopyCode={handleCopyCode}
        isExecuting={isExecuting}
        autoSave={autoSave}
      />

      <div className="editor-container">
        <Split
          className="split-horizontal"
          sizes={[20, 80]}
          minSize={150}
          gutterSize={8}
          cursor="col-resize"
        >
          <FileExplorer
            files={files}
            activeFileId={activeFileId}
            onFileSelect={setActiveFileId}
            onFileCreate={handleCreateFile}
            onFileDelete={handleDeleteFile}
            onFileRename={handleRenameFile}
          />

          <div className="editor-content">
            <div className="editor-tabs">
              {files.map(file => (
                <div
                  key={file.id}
                  className={`editor-tab ${file.id === activeFileId ? 'active' : ''}`}
                  onClick={() => setActiveFileId(file.id)}
                >
                  <span className="tab-name">{file.name}</span>
                  <button
                    className="tab-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <Split
              className="editor-console-split"
              direction="horizontal"
              sizes={[65, 35]}
              minSize={[300, 300]}
              gutterSize={8}
              cursor="col-resize"
            >
              <div className="editor-wrapper">
                <Editor
                  height="100%"
                  language={activeFile?.language}
                  value={activeFile?.content}
                  theme={theme}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize,
                    // Core editing features
                    minimap: { enabled: minimap },
                    wordWrap: wordWrap ? 'on' : 'off',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    folding: true,
                    lineNumbers: lineNumbers ? 'on' : 'off',
                    renderWhitespace: 'selection',
                    glyphMargin: true,
                    tabSize: 4,
                    insertSpaces: true,
                    detectIndentation: true,
                    trimAutoWhitespace: true,
                    rulers: [80, 120],
                    padding: { top: 16, bottom: 16 },
                    
                    // Mouse and interaction
                    links: true,
                    mouseWheelZoom: true,
                    multiCursorModifier: 'alt',
                    dragAndDrop: true,
                    copyWithSyntaxHighlighting: true,
                    
                    // Scrollbar
                    scrollbar: {
                      vertical: 'visible',
                      horizontal: 'visible',
                      verticalScrollbarSize: 12,
                      horizontalScrollbarSize: 12,
                      arrowSize: 30,
                      useShadows: true,
                      verticalHasArrows: false,
                      horizontalHasArrows: false,
                    },
                    
                    // Rendering
                    roundedSelection: true,
                    fixedOverflowWidgets: true,
                    renderFinalNewline: 'on',
                    renderControlCharacters: true,
                    renderValidationDecorations: 'on',
                    
                    // Cursor and selection
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    renderLineHighlight: 'all',
                    selectionHighlight: true,
                    occurrencesHighlight: 'multiFile',
                    
                    // Bracket features
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    autoClosingOvertype: 'always',
                    autoIndent: 'full',
                    bracketPairColorization: { enabled: true },
                    matchBrackets: 'always',
                    guides: {
                      bracketPairs: true,
                      bracketPairsHorizontal: true,
                      highlightActiveBracketPair: true,
                      indentation: true,
                      highlightActiveIndentation: true,
                    },
                    
                    // IntelliSense and suggestions
                    quickSuggestions: {
                      other: true,
                      comments: false,
                      strings: true,
                    },
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnCommitCharacter: true,
                    acceptSuggestionOnEnter: 'on',
                    snippetSuggestions: 'top',
                    wordBasedSuggestions: 'matchingDocuments',
                    suggest: {
                      showKeywords: true,
                      showSnippets: true,
                      showClasses: true,
                      showFunctions: true,
                      showVariables: true,
                    },
                    
                    // Parameter hints
                    parameterHints: {
                      enabled: true,
                      cycle: true,
                    },
                    
                    // Hover
                    hover: {
                      enabled: true,
                      delay: 300,
                      sticky: true,
                    },
                    
                    // Find and navigation
                    find: {
                      seedSearchStringFromSelection: 'always',
                      autoFindInSelection: 'never',
                      addExtraSpaceOnTop: true,
                    },
                    
                    // Formatting
                    formatOnPaste: true,
                    formatOnType: true,
                    
                    // Context menu
                    contextmenu: true,
                    
                    // Font settings
                    fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', 'Courier New', monospace",
                    fontLigatures: true,
                    fontWeight: '400',
                    
                    // Performance
                    fastScrollSensitivity: 5,
                    mouseWheelScrollSensitivity: 1,
                    
                    // Code lens
                    codeLens: true,
                    
                    // Validation
                    showUnused: true,
                    showDeprecated: true,
                    
                    // Accessibility
                    accessibilitySupport: 'auto',
                  }}
                />
              </div>

              <OutputConsole
                result={executionResult}
                input={consoleInput}
                onInputChange={setConsoleInput}
                onClear={() => setExecutionResult(null)}
                onClose={() => {}}
              />
            </Split>
          </div>
        </Split>
      </div>

      {showSettings && (
        <SettingsPanel
          theme={theme}
          onThemeChange={setTheme}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          autoSave={autoSave}
          onAutoSaveChange={setAutoSave}
          wordWrap={wordWrap}
          onWordWrapChange={setWordWrap}
          minimap={minimap}
          onMinimapChange={setMinimap}
          lineNumbers={lineNumbers}
          onLineNumbersChange={setLineNumbers}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default EditorPage;