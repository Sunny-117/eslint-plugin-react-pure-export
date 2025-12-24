/**
 * File pattern matching utilities for identifying pure modules and TSX files
 */

/**
 * Check if a filename matches a specific pattern
 * @param {string} filename - The filename to check
 * @param {string} pattern - The pattern to match (e.g., '*.pure.ts')
 * @returns {boolean} True if the filename matches the pattern
 */
function matchesPattern(filename, pattern) {
  if (!filename || typeof filename !== 'string') {
    return false;
  }
  
  if (!pattern || typeof pattern !== 'string') {
    return false;
  }
  
  // Convert glob pattern to regex
  // Escape special regex characters except *
  const regexPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  
  const regex = new RegExp(`^${regexPattern}$`);
  
  // Extract just the filename from the path
  const parts = filename.split(/[/\\]/);
  const baseFilename = parts[parts.length - 1];
  
  return regex.test(baseFilename);
}

/**
 * Check if a file is a pure module
 * Pure modules match patterns: *.pure.ts, *.utils.ts, *.config.ts
 * @param {string} filename - The filename to check
 * @returns {boolean} True if the file is a pure module
 */
function isPureModule(filename) {
  if (!filename || typeof filename !== 'string') {
    return false;
  }
  
  const purePatterns = [
    '*.pure.ts',
    '*.utils.ts',
    '*.config.ts'
  ];
  
  return purePatterns.some(pattern => matchesPattern(filename, pattern));
}

/**
 * Check if a file is a TSX file
 * @param {string} filename - The filename to check
 * @returns {boolean} True if the file has .tsx extension
 */
function isTsxFile(filename) {
  if (!filename || typeof filename !== 'string') {
    return false;
  }
  
  return matchesPattern(filename, '*.tsx');
}

module.exports = {
  matchesPattern,
  isPureModule,
  isTsxFile
};
