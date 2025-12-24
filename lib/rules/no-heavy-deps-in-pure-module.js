/**
 * @fileoverview Disallow heavy dependencies in pure modules
 * @author eslint-plugin-react-pure-export
 */

'use strict';

const { isPureModule } = require('../utils/file-pattern-matcher');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow heavy dependencies in pure modules',
      recommended: 'error',
      url: 'https://github.com/Sunny-117/eslint-plugin-react-pure-export/blob/main/docs/rules/no-heavy-deps-in-pure-module.md'
    },
    messages: {
      heavyDepInPureModule: 'Pure module should not import heavy dependency "{{source}}". Consider extracting to a separate module.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          forbiddenDeps: {
            type: 'array',
            items: { type: 'string' },
            default: ['react', 'react-dom']
          },
          forbiddenExtensions: {
            type: 'array',
            items: { type: 'string' },
            default: ['.css', '.less', '.scss']
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    const filename = context.getFilename();
    
    // Only apply this rule to pure module files
    if (!isPureModule(filename)) {
      return {};
    }

    // Get configuration options with defaults
    const options = context.options[0] || {};
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
              source
            }
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
                source
              }
            });
            return;
          }
        }
      }
    };
  }
};
