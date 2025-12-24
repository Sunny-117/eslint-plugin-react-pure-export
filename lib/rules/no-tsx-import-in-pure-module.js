/**
 * @fileoverview Disallow importing .tsx files in pure modules
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
      description: 'Disallow importing .tsx files in pure modules',
      recommended: 'error',
      url: 'https://github.com/Sunny-117/eslint-plugin-react-pure-export/blob/main/docs/rules/no-tsx-import-in-pure-module.md'
    },
    messages: {
      tsxImportInPureModule: 'Pure module should not depend on .tsx files. Import "{{source}}" is not allowed.'
    },
    schema: []
  },

  create(context) {
    const filename = context.getFilename();
    
    // Only apply this rule to pure module files
    if (!isPureModule(filename)) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        // Get the import source
        const source = node.source.value;
        
        // Check if the import source ends with .tsx
        if (source && typeof source === 'string' && source.endsWith('.tsx')) {
          context.report({
            node,
            messageId: 'tsxImportInPureModule',
            data: {
              source
            }
          });
        }
      }
    };
  }
};
