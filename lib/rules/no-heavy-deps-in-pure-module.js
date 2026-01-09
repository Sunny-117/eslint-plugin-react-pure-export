/* eslint-disable */
/**
 * @fileoverview Disallow heavy dependencies in pure modules
 * @author eslint-plugin-react-pure-export
 */

'use strict';

const {isPureModule} = require('../utils/file-pattern-matcher');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow heavy dependencies in pure modules',
            recommended: 'error',
        },
        messages: {
            heavyDepInPureModule: 'Pure module should not import heavy dependency "{{source}}". Consider extracting to a separate module.',
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
                    forbiddenDeps: {
                        type: 'array',
                        items: {type: 'string'},
                        default: ['react', 'react-dom'],
                    },
                    forbiddenExtensions: {
                        type: 'array',
                        items: {type: 'string'},
                        default: ['.css', '.less', '.scss'],
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

        // Only apply this rule to pure module files
        if (!isPureModule(filename, pureModulePatterns)) {
            return {};
        }

        // Get configuration options with defaults
        const forbiddenDeps = options.forbiddenDeps || ['react', 'react-dom'];
        const forbiddenExtensions = options.forbiddenExtensions || ['.css', '.less', '.scss'];

        return {
            ImportDeclaration(node) {
                // Get the import source
                const source = node.source.value;

                if (!source || typeof source !== 'string') {
                    return;
                }

                // Check if the import source is in the forbidden dependencies list
                if (forbiddenDeps.includes(source)) {
                    context.report({
                        node,
                        messageId: 'heavyDepInPureModule',
                        data: {
                            source,
                        },
                    });
                    return;
                }

                // Check if the import source has a forbidden extension
                for (const ext of forbiddenExtensions) {
                    if (source.endsWith(ext)) {
                        context.report({
                            node,
                            messageId: 'heavyDepInPureModule',
                            data: {
                                source,
                            },
                        });
                        return;
                    }
                }
            },
        };
    },
};
