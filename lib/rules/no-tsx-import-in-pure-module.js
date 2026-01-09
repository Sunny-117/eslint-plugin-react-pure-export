/* eslint-disable */
/**
 * @fileoverview Disallow importing .tsx files in pure modules
 * @author eslint-plugin-react-pure-export
 */

'use strict';

const {isPureModule} = require('../utils/file-pattern-matcher');
const {resolveImportPath, isTsxFile} = require('../utils/import-resolver');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow importing .tsx files in pure modules',
            recommended: 'error',
        },
        messages: {
            tsxImportInPureModule: 'Pure module should not depend on .tsx files. Import "{{source}}" is not allowed.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    pureModulePatterns: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'File patterns to identify pure modules (e.g., ["*.pure.ts", "*.utils.ts"]). Default: ["*.ts"]',
                    },
                    pathAliases: {
                        type: 'object',
                        additionalProperties: {
                            type: 'string',
                        },
                        description: 'Path aliases mapping (e.g., {"@": "./src", "@components": "./src/components"}). If not specified, reads from tsconfig.json',
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const filename = context.getFilename();
        const options = context.options[0] || {};
        const pureModulePatterns = options.pureModulePatterns || ['*.ts'];
        const customPathAliases = options.pathAliases;

        // Only apply this rule to pure module files
        if (!isPureModule(filename, pureModulePatterns)) {
            return {};
        }

        return {
            ImportDeclaration(node) {
                // Get the import source
                const source = node.source.value;

                if (!source || typeof source !== 'string') {
                    return;
                }

                // Check if the import source explicitly ends with .tsx
                if (source.endsWith('.tsx')) {
                    context.report({
                        node,
                        messageId: 'tsxImportInPureModule',
                        data: {
                            source,
                        },
                    });
                    return;
                }

                // For imports without explicit extension, resolve the actual file
                // Pass custom path aliases if provided
                const resolvedPath = resolveImportPath(source, filename, customPathAliases);
                if (resolvedPath && isTsxFile(resolvedPath)) {
                    context.report({
                        node,
                        messageId: 'tsxImportInPureModule',
                        data: {
                            source: `${source} (resolves to .tsx file)`,
                        },
                    });
                }
            },
        };
    },
};
