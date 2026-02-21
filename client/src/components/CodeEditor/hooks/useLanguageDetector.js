/**
 * useLanguageDetector Hook
 * Automatically detects programming language from code or file extension
 */

import { detectLanguage, getLanguageByExtension } from '../languages';

export const useLanguageDetector = (code = '', filename = '') => {
  const getDetectedLanguage = () => {
    // Try file extension first
    if (filename) {
      try {
        const langDef = getLanguageByExtension(filename);
        if (langDef) return langDef.name;
      } catch (error) {
        console.warn('Could not detect language by extension:', error);
      }
    }

    // Then try content detection
    if (code && code.length > 0) {
      return detectLanguage(code);
    }

    return 'javascript';
  };

  const detectFromContent = (content) => {
    return detectLanguage(content);
  };

  const detectFromExtension = (fname) => {
    try {
      const langDef = getLanguageByExtension(fname);
      return langDef ? langDef.name : 'javascript';
    } catch {
      return 'javascript';
    }
  };

  return {
    language: getDetectedLanguage(),
    detectFromContent,
    detectFromExtension,
    getDetectedLanguage
  };
};

export default useLanguageDetector;
