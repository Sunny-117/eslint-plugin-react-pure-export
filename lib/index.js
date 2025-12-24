/**
 * @fileoverview ESLint plugin to enforce separation between React components and pure logic modules
 * @author eslint-plugin-react-pure-export
 */

'use strict';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = {
  rules: {
    'no-non-component-export-in-tsx': require('./rules/no-non-component-export-in-tsx'),
    'no-tsx-import-in-pure-module': require('./rules/no-tsx-import-in-pure-module'),
    'no-heavy-deps-in-pure-module': require('./rules/no-heavy-deps-in-pure-module')
  },
  configs: {
    recommended: {
      plugins: ['react-pure-export'],
      rules: {
        'react-pure-export/no-non-component-export-in-tsx': 'error',
        'react-pure-export/no-tsx-import-in-pure-module': 'error',
        'react-pure-export/no-heavy-deps-in-pure-module': 'error'
      }
    }
  }
};
