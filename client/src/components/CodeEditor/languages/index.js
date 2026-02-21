/**
 * Language Registry
 * Central export point for all language definitions
 */

import { c } from './c';
import { cpp } from './cpp';
import { java } from './java';
import { python } from './python';
import { javascript } from './javascript';
import { html } from './html';
import { css } from './css';

export const languages = {
  c,
  cpp,
  java,
  python,
  javascript,
  html,
  css
};

// Map file extensions to language
export const extensionMap = {
  '.c': 'c',
  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.java': 'java',
  '.py': 'python',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.mjs': 'javascript',
  '.html': 'html',
  '.htm': 'html',
  '.css': 'css',
  '.h': 'c',
  '.hpp': 'cpp',
  '.hxx': 'cpp'
};

// Map keywords to language (for auto-detection)
export const keywordMap = {
  'def': 'python',
  'class': ['java', 'python', 'cpp', 'javascript'],
  'function': 'javascript',
  'var': 'javascript',
  'let': 'javascript',
  'const': 'javascript',
  'public': ['java', 'cpp'],
  'void': ['c', 'cpp', 'java'],
  '#include': ['c', 'cpp'],
  'import': ['java', 'python'],
  'printl': 'java',
  'console.log': 'javascript'
};

// Get language definition by name
export const getLanguage = (languageName) => {
  return languages[languageName] || languages.javascript;
};

// Get language by file extension
export const getLanguageByExtension = (filename) => {
  const ext = '.' + filename.split('.').pop().toLowerCase();
  const langName = extensionMap[ext] || 'javascript';
  return languages[langName];
};

// Detect language by content (simple keyword matching)
export const detectLanguage = (code) => {
  if (!code || typeof code !== 'string') return 'javascript';

  // Check for keywords
  const keywords = {
    'python': ['def ', 'class ', 'if __name__', 'import ', 'from '],
    'java': ['public class', 'public static void', 'package ', '@Override'],
    'cpp': ['#include', 'using namespace', 'std::'],
    'c': ['#include', 'void ', 'int main'],
    'html': ['<!DOCTYPE', '<html', '<head', '<body'],
    'css': ['@media', '@import', '@keyframes', 'background-color:']
  };

  for (const [lang, keywordList] of Object.entries(keywords)) {
    if (keywordList.some(keyword => code.includes(keyword))) {
      return lang;
    }
  }

  return 'javascript'; // default
};

export default languages;
