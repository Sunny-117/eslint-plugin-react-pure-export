/**
 * @fileoverview Utility to detect JSX usage in AST nodes
 * @author eslint-plugin-react-pure-export
 */

'use strict';

/**
 * Check if a node or its descendants contain JSX elements
 * @param {Object} node - The AST node to check
 * @returns {boolean} True if the node contains JSX
 */
function containsJSX(node) {
    if (!node) {
        return false;
    }

    // Direct JSX element or fragment
    if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
        return true;
    }

    // Check all properties of the node recursively
    for (const key in node) {
        if (!node.hasOwnProperty(key)) {
            continue;
        }

        const value = node[key];

        // Skip certain properties that don't need checking
        if (key === 'parent' || key === 'loc' || key === 'range' || key === 'tokens' || key === 'comments') {
            continue;
        }

        // Check arrays (like body, arguments, etc.)
        if (Array.isArray(value)) {
            for (const item of value) {
                if (item && typeof item === 'object' && containsJSX(item)) {
                    return true;
                }
            }
        }
        // Check nested objects
        else if (value && typeof value === 'object') {
            if (containsJSX(value)) {
                return true;
            }
        }
    }

    return false;
}

module.exports = {
    containsJSX,
};
