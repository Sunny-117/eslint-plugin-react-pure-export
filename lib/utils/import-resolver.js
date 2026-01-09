/* eslint-disable */
/**
 * @fileoverview Utility to resolve import paths to actual files
 * @author eslint-plugin-react-pure-export
 */

'use strict';

const path = require('path');
const fs = require('fs');

/**
 * Find tsconfig.json starting from a directory
 * @param {string} startDir - Directory to start searching from
 * @returns {string|null} Path to tsconfig.json or null
 */
function findTsConfig(startDir) {
    let currentDir = startDir;

    while (currentDir !== path.dirname(currentDir)) {
        const tsconfigPath = path.join(currentDir, 'tsconfig.json');
        if (fs.existsSync(tsconfigPath)) {
            return tsconfigPath;
        }
        currentDir = path.dirname(currentDir);
    }

    return null;
}

/**
 * Parse tsconfig.json and extract path aliases
 * @param {string} tsconfigPath - Path to tsconfig.json
 * @returns {Object} Map of alias to base path
 */
function parseTsConfigPaths(tsconfigPath) {
    try {
        const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf-8');
        // Remove comments (simple approach, may not handle all cases)
        const jsonContent = tsconfigContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        const tsconfig = JSON.parse(jsonContent);

        const paths = tsconfig?.compilerOptions?.paths || {};
        const baseUrl = tsconfig?.compilerOptions?.baseUrl || '.';
        const tsconfigDir = path.dirname(tsconfigPath);
        const resolvedBaseUrl = path.resolve(tsconfigDir, baseUrl);

        const aliases = {};
        for (const [alias, targets] of Object.entries(paths)) {
            // Remove trailing /* from alias
            const cleanAlias = alias.replace(/\/\*$/, '');
            // Get first target and remove trailing /*
            const target = Array.isArray(targets) ? targets[0] : targets;
            const cleanTarget = target.replace(/\/\*$/, '');
            // Resolve target relative to baseUrl
            aliases[cleanAlias] = path.resolve(resolvedBaseUrl, cleanTarget);
        }

        return aliases;
    } catch (e) {
        // If parsing fails, return empty aliases
        return {};
    }
}

// Cache for tsconfig paths to avoid repeated file reads
const tsconfigCache = new Map();

/**
 * Get path aliases for a given file
 * @param {string} fromFile - The file that contains the import
 * @returns {Object} Map of alias to base path
 */
function getPathAliases(fromFile) {
    const fromDir = path.dirname(fromFile);

    // Check cache first
    if (tsconfigCache.has(fromDir)) {
        return tsconfigCache.get(fromDir);
    }

    const tsconfigPath = findTsConfig(fromDir);
    const aliases = tsconfigPath ? parseTsConfigPaths(tsconfigPath) : {};

    // Cache the result
    tsconfigCache.set(fromDir, aliases);

    return aliases;
}

/**
 * Resolve an import source to an actual file path
 * @param {string} importSource - The import source (e.g., './Component' or '@/components/Button')
 * @param {string} fromFile - The file that contains the import
 * @param {Object} customAliases - Optional custom path aliases from ESLint config
 * @returns {string|null} The resolved file path, or null if not found
 */
function resolveImportPath(importSource, fromFile, customAliases = null) {
    // Skip node_modules imports (unless they start with @ but are relative)
    if (!importSource.startsWith('.') && !importSource.startsWith('/') && !importSource.startsWith('@')) {
        return null;
    }

    // Get the directory of the importing file
    const fromDir = path.dirname(fromFile);

    let basePath;

    // Check if import uses path alias
    if (!importSource.startsWith('.') && !importSource.startsWith('/')) {
        // Use custom aliases if provided, otherwise read from tsconfig
        const aliases = customAliases ? normalizeCustomAliases(customAliases, fromDir) : getPathAliases(fromFile);

        // Try to match alias
        let matched = false;
        for (const [alias, aliasPath] of Object.entries(aliases)) {
            if (importSource === alias || importSource.startsWith(alias + '/')) {
                // Replace alias with actual path
                const relativePath = importSource.slice(alias.length);
                basePath = path.join(aliasPath, relativePath);
                matched = true;
                break;
            }
        }

        // If no alias matched, it might be a node_modules import
        if (!matched) {
            return null;
        }
    } else {
        // Resolve relative path
        basePath = path.resolve(fromDir, importSource);
    }

    // If the import already has an extension, check if it exists
    if (path.extname(importSource)) {
        if (fs.existsSync(basePath)) {
            return basePath;
        }
        return null;
    }

    // Try common extensions in order: .tsx, .ts, .jsx, .js
    const extensions = ['.tsx', '.ts', '.jsx', '.js'];

    for (const ext of extensions) {
        const fullPath = basePath + ext;
        if (fs.existsSync(fullPath)) {
            return fullPath;
        }
    }

    // Try index files
    for (const ext of extensions) {
        const indexPath = path.join(basePath, `index${ext}`);
        if (fs.existsSync(indexPath)) {
            return indexPath;
        }
    }

    return null;
}

/**
 * Normalize custom aliases from ESLint config to absolute paths
 * @param {Object} customAliases - Custom aliases from ESLint config (e.g., {"@": "./src"})
 * @param {string} fromDir - The directory to resolve relative paths from
 * @returns {Object} Normalized aliases with absolute paths
 */
function normalizeCustomAliases(customAliases, fromDir) {
    const normalized = {};

    // Find the workspace root (where package.json or tsconfig.json exists)
    let workspaceRoot = fromDir;
    while (workspaceRoot !== path.dirname(workspaceRoot)) {
        if (fs.existsSync(path.join(workspaceRoot, 'package.json')) ||
            fs.existsSync(path.join(workspaceRoot, 'tsconfig.json'))) {
            break;
        }
        workspaceRoot = path.dirname(workspaceRoot);
    }

    for (const [alias, aliasPath] of Object.entries(customAliases)) {
        // If aliasPath is already absolute, use it directly
        // Otherwise, resolve it relative to workspace root
        const resolvedPath = path.isAbsolute(aliasPath)
            ? aliasPath
            : path.resolve(workspaceRoot, aliasPath);
        normalized[alias] = resolvedPath;
    }

    return normalized;
}

/**
 * Check if a resolved file path is a .tsx file
 * @param {string} filePath - The file path to check
 * @returns {boolean} True if the file is a .tsx file
 */
function isTsxFile(filePath) {
    if (!filePath) {
        return false;
    }
    return filePath.endsWith('.tsx');
}

module.exports = {
    resolveImportPath,
    isTsxFile,
};
