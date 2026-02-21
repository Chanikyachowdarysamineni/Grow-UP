/**
 * useTokenizer Hook
 * Handles code tokenization for syntax highlighting
 */

import { useState, useCallback, useRef } from 'react';
import { languages, getLanguage } from '../languages';

export const useTokenizer = (language = 'javascript') => {
  const [cachedTokens, setCachedTokens] = useState({});
  const cacheRef = useRef(cachedTokens);
  const langDef =  getLanguage(language);

  // Generate unique cache key
  const getCacheKey = useCallback((code) => {
    return `${language}_${code.length}_${code.charCodeAt(0) || 0}`;
  }, [language]);

  // Tokenize code into tokens with types
  const tokenize = useCallback((code) => {
    if (!code) return [];
    if (!langDef || !langDef.tokenRules) return [{ type: 'text', value: code }];

    const tokens = [];
    let remainingCode = code;
    let position = 0;

    while (remainingCode.length > 0) {
      let matched = false;

      for (const rule of langDef.tokenRules) {
        const match = remainingCode.match(rule.pattern);
        if (match && match.index === 0) {
          const matchedText = match[0];

          // Create token
          const token = {
            type: rule.type,
            value: matchedText,
            position,
            subMatches: null
          };

          // Handle sub-matches (for complex patterns)
          if (rule.subMatches && match.length > 1) {
            token.subMatches = rule.subMatches.map(subMatch => ({
              ...subMatch,
              value: match[subMatch.index] || ''
            }));
          }

          tokens.push(token);
          remainingCode = remainingCode.substring(matchedText.length);
          position += matchedText.length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        // No rule matched, consume one character as text
        tokens.push({
          type: 'text',
          value: remainingCode[0],
          position
        });
        remainingCode = remainingCode.substring(1);
        position += 1;
      }
    }

    return tokens;
  }, [langDef]);

  // Get tokens with caching
  const getTokens = useCallback((code) => {
    const key = getCacheKey(code);

    if (cacheRef.current[key]) {
      return cacheRef.current[key];
    }

    const tokens = tokenize(code);
    const newCache = { ...cacheRef.current, [key]: tokens };
    cacheRef.current = newCache;
    setCachedTokens(newCache);

    return tokens;
  }, [tokenize, getCacheKey]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current = {};
    setCachedTokens({});
  }, []);

  // Get tokens for a specific line
  const getLineTokens = useCallback((code, lineNumber) => {
    const lines = code.split('\n');
    if (lineNumber < 0 || lineNumber >= lines.length) return [];

    const line = lines[lineNumber];
    return tokenize(line);
  }, [tokenize]);

  // Check if token type should be highlighted
  const isHighlightableToken = useCallback((tokenType) => {
    const nonHighlightable = ['text', 'punctuation', 'whitespace'];
    return !nonHighlightable.includes(tokenType);
  }, []);

  // Get token at position
  const getTokenAtPosition = useCallback((code, position) => {
    const tokens = getTokens(code);
    let pos = 0;

    for (const token of tokens) {
      if (position >= pos && position < pos + token.value.length) {
        return { token, index: tokens.indexOf(token) };
      }
      pos += token.value.length;
    }

    return null;
  }, [getTokens]);

  return {
    tokenize,
    getTokens,
    getLineTokens,
    getTokenAtPosition,
    isHighlightableToken,
    clearCache,
    language
  };
};

export default useTokenizer;
