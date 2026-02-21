const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory file storage (alternative: could use filesystem)
let files = [
  {
    id: '1',
    name: 'example.js',
    language: 'javascript',
    content: '// Welcome to the Code Playground!\nconsole.log("Hello, World!");'
  },
  {
    id: '2',
    name: 'styles.css',
    language: 'css',
    content: '/* CSS Example */\nbody {\n  margin: 0;\n  padding: 0;\n}'
  },
  {
    id: '3',
    name: 'index.html',
    language: 'html',
    content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Example</title>\n</head>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>'
  }
];

let fileIdCounter = 4;

// GET /api/files - Get all files
app.get('/api/files', (req, res) => {
  res.json(files);
});

// GET /api/files/:id - Get a specific file
app.get('/api/files/:id', (req, res) => {
  const file = files.find(f => f.id === req.params.id);
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.json(file);
});

// POST /api/files - Create a new file
app.post('/api/files', (req, res) => {
  const { name, language = 'javascript', content = '' } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'File name is required' });
  }

  const newFile = {
    id: String(fileIdCounter++),
    name,
    language,
    content,
    createdAt: new Date().toISOString()
  };

  files.push(newFile);
  res.status(201).json(newFile);
});

// PUT /api/files/:id - Update a file
app.put('/api/files/:id', (req, res) => {
  const file = files.find(f => f.id === req.params.id);
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  const { content, name, language } = req.body;

  if (content !== undefined) file.content = content;
  if (name !== undefined) file.name = name;
  if (language !== undefined) file.language = language;
  file.updatedAt = new Date().toISOString();

  res.json(file);
});

// DELETE /api/files/:id - Delete a file
app.delete('/api/files/:id', (req, res) => {
  const index = files.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'File not found' });
  }

  const deletedFile = files.splice(index, 1)[0];
  res.json(deletedFile);
});

// POST /api/execute - Execute code
app.post('/api/execute', (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  // Mock execution - in production, this would use a sandboxed environment
  try {
    // Simple validation for different languages
    let output = '';
    
    if (language === 'javascript') {
      output = `JavaScript execution output:\n${code}`;
    } else if (language === 'python') {
      output = `Python execution output:\n${code}`;
    } else if (language === 'html') {
      output = code;
    } else {
      output = `Execution for ${language}:\n${code}`;
    }

    res.json({
      success: true,
      output,
      language,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'File & Code Execution Server',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║         🔧 FILE & CODE EXECUTION SERVER RUNNING 🔧         ║
    ║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━║
    ║  Server: http://localhost:${PORT}                           ║
    ║  Files API: http://localhost:${PORT}/api/files               ║
    ║  Execute API: http://localhost:${PORT}/api/execute           ║
    ║  Health: http://localhost:${PORT}/api/health                 ║
    ║════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
