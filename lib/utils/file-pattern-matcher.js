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

    // Extract just the filename from the path
    const parts = filename.split(/[/\\]/);
    const baseFilename = parts[parts.length - 1];

    // Convert glob pattern to regex
    // Escape special regex characters except *
    const regexPattern = pattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');

    const regex = new RegExp(`^${regexPattern}$`);

    return regex.test(baseFilename);
}

/**
 * Check if a file is a pure module
 * @param {string} filename - The filename to check
 * @param {string[]} patterns - Optional custom patterns. If not provided (undefined), defaults to all .ts files
 * @returns {boolean} True if the file is a pure module
 */
function isPureModule(filename, patterns) {
    if (!filename || typeof filename !== 'string') {
        return false;
    }

    // If patterns is explicitly provided (even if empty array), use it
    // If patterns is undefined (not provided), default to matching all .ts files
    let purePatterns;
    if (patterns === undefined) {
        // Default: match all files ending with .ts
        purePatterns = ['*.ts'];
    } else if (patterns.length === 0) {
        // Empty array provided: match all .ts files (same as default)
        purePatterns = ['*.ts'];
    } else {
        // Custom patterns provided: use them
        purePatterns = patterns;
    }

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
    isTsxFile,
};
