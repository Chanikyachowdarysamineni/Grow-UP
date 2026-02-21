/**
 * Search and Replace Utility
 * Handles find, find-all, replace, replace-all operations
 */

export const searchUtils = {
  // Find first occurrence
  findFirst(code, searchTerm, startPos = 0, caseSensitive = false) {
    if (!searchTerm) return -1;

    const search = caseSensitive ? searchTerm : searchTerm.toLowerCase();
    const text = caseSensitive ? code : code.toLowerCase();

    const pos = text.indexOf(search, startPos);
    return pos >= 0 ? pos : -1;
  },

  // Find all occurrences with positions
  findAll(code, searchTerm, caseSensitive = false) {
    if (!searchTerm) return [];

    const results = [];
    const search = caseSensitive ? searchTerm : searchTerm.toLowerCase();
    const text = caseSensitive ? code : code.toLowerCase();

    let pos = 0;
    while ((pos = text.indexOf(search, pos)) !== -1) {
      results.push({
        start: pos,
        end: pos + searchTerm.length,
        text: code.substring(pos, pos + searchTerm.length),
        line: code.substring(0, pos).split('\n').length - 1,
        column: pos - code.lastIndexOf('\n', pos)
      });
      pos += 1;
    }

    return results;
  },

  // Find with regex
  findRegex(code, pattern, flags = 'g') {
    try {
      const regex = new RegExp(pattern, flags);
      const results = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(code)) !== null) {
          results.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            line: code.substring(0, match.index).split('\n').length - 1,
            column: match.index - code.lastIndexOf('\n', match.index),
            groups: match.slice(1)
          });
        }
      } else {
        match = regex.exec(code);
        if (match) {
          results.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            line: code.substring(0, match.index).split('\n').length - 1,
            column: match.index - code.lastIndexOf('\n', match.index),
            groups: match.slice(1)
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Invalid regex pattern:', error);
      return [];
    }
  },

  // Replace first occurrence
  replaceFirst(code, searchTerm, replacement, caseSensitive = false) {
    const pos = this.findFirst(code, searchTerm, 0, caseSensitive);
    if (pos === -1) return code;

    const before = code.substring(0, pos);
    const after = code.substring(pos + searchTerm.length);
    return before + replacement + after;
  },

  // Replace all occurrences
  replaceAll(code, searchTerm, replacement, caseSensitive = false) {
    const search = caseSensitive ? searchTerm : searchTerm.toLowerCase();
    const text = caseSensitive ? code : code.toLowerCase();

    let result = code;
    let lastIndex = 0;

    while (true) {
      const pos = text.substring(lastIndex).indexOf(search);
      if (pos === -1) break;

      const actualPos = lastIndex + pos;
      const before = result.substring(0, actualPos);
      const after = result.substring(actualPos + searchTerm.length);
      result = before + replacement + after;

      lastIndex = actualPos + replacement.length;
    }

    return result;
  },

  // Replace using regex
  replaceRegex(code, pattern, replacement, flags = 'g') {
    try {
      const regex = new RegExp(pattern, flags);
      return code.replace(regex, replacement);
    } catch (error) {
      console.error('Invalid regex pattern:', error);
      return code;
    }
  },

  // Get match count
  getMatchCount(code, searchTerm, caseSensitive = false) {
    return this.findAll(code, searchTerm, caseSensitive).length;
  },

  // Highlight matches (return positions and text)
  getHighlights(code, searchTerm, caseSensitive = false) {
    return this.findAll(code, searchTerm, caseSensitive).map(result => ({
      start: result.start,
      end: result.end
    }));
  },

  // Get context around match (for preview)
  getContext(code, start, end, contextLength = 50) {
    const before = Math.max(0, start - contextLength);
    const after = Math.min(code.length, end + contextLength);

    const beforeText = code.substring(before, start);
    const matchText = code.substring(start, end);
    const afterText = code.substring(end, after);

    return {
      before: beforeText,
      match: matchText,
      after: afterText,
      full: beforeText + matchText + afterText
    };
  }
};

export default searchUtils;
