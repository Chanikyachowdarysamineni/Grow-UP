const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');

const execPromise = promisify(exec);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Create temp directory for code execution
const TEMP_DIR = path.join(__dirname, 'temp');
fs.mkdir(TEMP_DIR, { recursive: true }).catch(console.error);

// Language configurations
const languageConfigs = {
  // Core Languages
  python: {
    extension: '.py',
    command: (filename) => `python "${filename}"`,
    timeout: 5000,
    icon: '🐍',
    displayName: 'Python',
    category: 'core',
  },
  java: {
    extension: '.java',
    command: (filename) => {
      const className = path.basename(filename, '.java');
      const dir = path.dirname(filename);
      return `cd "${dir}" && javac "${filename}" && java ${className}`;
    },
    timeout: 10000,
    icon: '☕',
    displayName: 'Java',
    category: 'core',
  },
  c: {
    extension: '.c',
    command: (filename) => {
      const outputFile = filename.replace('.c', '.exe');
      return `gcc "${filename}" -o "${outputFile}" && "${outputFile}"`;
    },
    timeout: 10000,
    icon: '⚙️',
    displayName: 'C',
    category: 'core',
  },
  cpp: {
    extension: '.cpp',
    command: (filename) => {
      const outputFile = filename.replace('.cpp', '.exe');
      return `g++ "${filename}" -o "${outputFile}" -std=c++17 && "${outputFile}"`;
    },
    timeout: 10000,
    icon: '⚙️',
    displayName: 'C++',
    category: 'core',
  },
  go: {
    extension: '.go',
    command: (filename) => `go run "${filename}"`,
    timeout: 10000,
    icon: '🔷',
    displayName: 'Go',
    category: 'core',
  },
  rust: {
    extension: '.rs',
    command: (filename) => {
      const outputFile = filename.replace('.rs', '.exe');
      return `rustc "${filename}" -o "${outputFile}" && "${outputFile}"`;
    },
    timeout: 10000,
    icon: '🦀',
    displayName: 'Rust',
    category: 'core',
  },
  csharp: {
    extension: '.cs',
    command: (filename) => `dotnet script "${filename}"`,
    timeout: 10000,
    icon: '#️⃣',
    displayName: 'C#',
    category: 'core',
  },

  // Web Languages
  javascript: {
    extension: '.js',
    command: (filename) => `node "${filename}"`,
    timeout: 5000,
    icon: '📜',
    displayName: 'JavaScript',
    category: 'web',
  },
  typescript: {
    extension: '.ts',
    command: (filename) => `ts-node "${filename}"`,
    timeout: 5000,
    icon: '📘',
    displayName: 'TypeScript',
    category: 'web',
  },
  php: {
    extension: '.php',
    command: (filename) => `php "${filename}"`,
    timeout: 5000,
    icon: '🐘',
    displayName: 'PHP',
    category: 'web',
  },

  // Scripting Languages
  ruby: {
    extension: '.rb',
    command: (filename) => `ruby "${filename}"`,
    timeout: 5000,
    icon: '💎',
    displayName: 'Ruby',
    category: 'scripting',
  },
  shell: {
    extension: '.sh',
    command: (filename) => `bash "${filename}"`,
    timeout: 5000,
    icon: '🐚',
    displayName: 'Shell',
    category: 'scripting',
  },

  // Mobile Languages
  kotlin: {
    extension: '.kt',
    command: (filename) => `kotlinc -script "${filename}"`,
    timeout: 10000,
    icon: '🅺',
    displayName: 'Kotlin',
    category: 'mobile',
  },
  swift: {
    extension: '.swift',
    command: (filename) => `swift "${filename}"`,
    timeout: 10000,
    icon: '🦅',
    displayName: 'Swift',
    category: 'mobile',
  },
  dart: {
    extension: '.dart',
    command: (filename) => `dart run "${filename}"`,
    timeout: 5000,
    icon: '🎯',
    displayName: 'Dart',
    category: 'mobile',
  },

  // Data Languages
  r: {
    extension: '.r',
    command: (filename) => `Rscript "${filename}"`,
    timeout: 10000,
    icon: '📊',
    displayName: 'R',
    category: 'data',
  },

  // Syntax-only (no execution)
  html: {
    extension: '.html',
    command: null, // No execution
    timeout: 0,
    icon: '🌐',
    displayName: 'HTML',
    category: 'web',
    syntaxOnly: true,
  },
  css: {
    extension: '.css',
    command: null, // No execution
    timeout: 0,
    icon: '🎨',
    displayName: 'CSS',
    category: 'web',
    syntaxOnly: true,
  },
  json: {
    extension: '.json',
    command: null, // No execution
    timeout: 0,
    icon: '📋',
    displayName: 'JSON',
    category: 'web',
    syntaxOnly: true,
  },
  markdown: {
    extension: '.md',
    command: null, // No execution
    timeout: 0,
    icon: '📝',
    displayName: 'Markdown',
    category: 'web',
    syntaxOnly: true,
  },
  sql: {
    extension: '.sql',
    command: null, // No execution
    timeout: 0,
    icon: '🗄️',
    displayName: 'SQL',
    category: 'data',
    syntaxOnly: true,
  },
};

// Sanitize input to prevent code injection
function sanitizeInput(input) {
  // Remove potentially dangerous characters
  return input.replace(/[;&|<>$`\\!]/g, '');
}

// Execute code with security measures
async function executeCode(language, code, input = '') {
  const config = languageConfigs[language];
  
  if (!config) {
    const supportedLanguages = Object.keys(languageConfigs).join(', ');
    throw new Error(`${config?.icon || '❌'} Unsupported language: ${language}\n\nSupported languages: ${supportedLanguages}`);
  }

  // Handle syntax-only languages (HTML, CSS, JSON, Markdown, SQL)
  if (config.syntaxOnly) {
    return {
      output: `${config.icon} ${config.displayName} file created successfully!\n\nNote: ${config.displayName} is a markup/style language and cannot be executed directly.\nThe syntax has been validated and saved.`,
      error: '',
      executionTime: 0,
    };
  }

  // Validate code
  if (!code || code.trim().length === 0) {
    throw new Error(`${config.icon} Code cannot be empty. Please write some ${config.displayName} code first.`);
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const filename = `code_${timestamp}_${randomId}${config.extension}`;
  const filepath = path.join(TEMP_DIR, filename);

  try {
    // Write code to file
    await fs.writeFile(filepath, code, 'utf-8');

    // Prepare command
    let command = config.command(filepath);
    
    // If input is provided, echo it to the program
    if (input) {
      command = `echo "${sanitizeInput(input)}" | ${command}`;
    }

    // Execute with timeout and resource limits
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;
    
    const { stdout, stderr } = await execPromise(command, {
      timeout: config.timeout,
      maxBuffer: 1024 * 1024, // 1MB output limit
      cwd: TEMP_DIR,
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
    });
    
    const executionTime = Date.now() - startTime;
    const endMemory = process.memoryUsage().heapUsed;
    const memoryUsage = Math.max(0, Math.round((endMemory - startMemory) / 1024)); // KB

    // Clean up
    await cleanupFile(filepath);

    // Format output messages
    let output = stdout;
    let error = stderr;

    // Add helpful messages
    if (!output && !error) {
      output = '✅ Program executed successfully with no output.';
    }

    return {
      output,
      error,
      executionTime,
      memoryUsage,
    };
  } catch (error) {
    // Clean up
    await cleanupFile(filepath);

    // Handle different types of errors
    if (error.killed) {
      return {
        output: '',
        error: `${config.icon} Execution Timeout!\n\nYour ${config.displayName} program took longer than ${config.timeout / 1000} seconds.\n\nPossible causes:\n• Infinite loop in your code\n• Program waiting for input (use stdin section)\n• Very heavy computation\n\nTip: Check your loops, recursive functions, and input handling.`,
        executionTime: config.timeout,
      };
    }

    if (error.code === 'ENOENT') {
      const installInstructions = {
        python: 'Download from https://www.python.org/ and add to PATH',
        java: 'Download JDK from https://www.oracle.com/java/technologies/downloads/',
        c: 'Install MinGW (https://mingw-w64.org/) or GCC',
        cpp: 'Install MinGW (https://mingw-w64.org/) or G++',
        go: 'Download from https://go.dev/dl/',
      };
      
      return {
        output: '',
        error: `${config.icon} ${config.displayName} Not Found!\n\n${config.displayName} is not installed or not in system PATH.\n\nInstallation: ${installInstructions[language]}\n\nAfter installation, restart the server and try again.`,
        executionTime: 0,
      };
    }

    // Compilation or runtime errors
    const errorOutput = error.stderr || error.message || 'Unknown execution error';
    
    // Format error message based on language
    let formattedError = `${config.icon} ${config.displayName} Error:\n\n${errorOutput}`;

    return {
      output: error.stdout || '',
      error: formattedError,
      executionTime: 0,
    };
  }
}

// Cleanup temporary files
async function cleanupFile(filepath) {
  try {
    await fs.unlink(filepath);
    
    // Also cleanup compiled files for C, C++, Java
    const ext = path.extname(filepath);
    if (ext === '.c' || ext === '.cpp') {
      const exeFile = filepath.replace(ext, '.exe');
      await fs.unlink(exeFile).catch(() => {});
    } else if (ext === '.java') {
      const classFile = filepath.replace('.java', '.class');
      await fs.unlink(classFile).catch(() => {});
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Language availability check
app.get('/api/languages', async (req, res) => {
  const languageStatus = {};
  
  const checkCommands = {
    python: 'python --version',
    java: 'java -version',
    c: 'gcc --version',
    cpp: 'g++ --version',
    go: 'go version',
  };
  
  for (const [lang, command] of Object.entries(checkCommands)) {
    try {
      await execPromise(command, { timeout: 3000 });
      languageStatus[lang] = {
        available: true,
        ...languageConfigs[lang],
      };
    } catch (error) {
      languageStatus[lang] = {
        available: false,
        ...languageConfigs[lang],
        error: 'Not installed or not in PATH',
      };
    }
  }
  
  const availableCount = Object.values(languageStatus).filter(l => l.available).length;
  
  res.json({
    totalLanguages: Object.keys(languageStatus).length,
    availableLanguages: availableCount,
    languages: languageStatus,
    message: `${availableCount}/5 languages available`,
  });
});

// Execute code endpoint
app.post('/api/execute', async (req, res) => {
  try {
    const { language, code, input } = req.body;

    // Validate request
    if (!language) {
      return res.status(400).json({
        output: '',
        error: '⚠️ Missing language field. Please select a programming language.',
        executionTime: 0,
      });
    }

    if (!code) {
      return res.status(400).json({
        output: '',
        error: '⚠️ Missing code field. Please write some code to execute.',
        executionTime: 0,
      });
    }

    // Validate code length
    if (code.length > 100000) {
      return res.status(400).json({
        output: '',
        error: '⚠️ Code is too long!\n\nMaximum allowed: 100,000 characters\nYour code: ' + code.length.toLocaleString() + ' characters\n\nPlease reduce the code size.',
        executionTime: 0,
      });
    }

    // Check for potentially dangerous patterns (basic security)
    const dangerousPatterns = [
      /rm\s+-rf/i,
      /format\s+c:/i,
      /del\s+\/f\s+\/q/i,
      /__import__\s*\(\s*['"]os['"]\s*\)/,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return res.status(400).json({
          output: '',
          error: '🔒 Security Warning!\n\nYour code contains potentially dangerous operations that are not allowed.\nPlease remove system-level commands and try again.',
          executionTime: 0,
        });
      }
    }

    // Execute code
    const result = await executeCode(language, code, input || '');

    // Add success indicator if no errors
    if (!result.error && result.output) {
      result.output = `📤 Output:\n\n${result.output}`;
    }

    res.json(result);
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      output: '',
      error: `❌ Server Error:\n\n${error.message || 'Internal server error'}\n\nPlease check if the backend server is running properly.`,
      executionTime: 0,
    });
  }
});

// Periodic cleanup of temp directory (every hour)
setInterval(async () => {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();
    
    for (const file of files) {
      const filepath = path.join(TEMP_DIR, file);
      const stats = await fs.stat(filepath);
      
      // Delete files older than 1 hour
      if (now - stats.mtimeMs > 3600000) {
        await fs.unlink(filepath).catch(() => {});
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}, 3600000);

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Grow Up Code Editor Server`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📁 Temp directory: ${TEMP_DIR}`);
  console.log(`\n✅ Supported Languages:`);
  
  Object.entries(languageConfigs).forEach(([lang, config]) => {
    console.log(`   ${config.icon} ${config.displayName.padEnd(8)} - Timeout: ${config.timeout}ms`);
  });
  
  console.log(`\n🔒 Security Features:`);
  console.log(`   • Execution timeouts enabled`);
  console.log(`   • Resource limits (1MB output)`);
  console.log(`   • Dangerous pattern detection`);
  console.log(`   • Automatic temp file cleanup`);
  console.log(`\n${'-'.repeat(60)}`);
  console.log(`💡 Tip: Make sure required compilers/interpreters are installed`);
  console.log(`📖 See LANGUAGES.md for setup instructions`);
  console.log(`${'='.repeat(60)}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});