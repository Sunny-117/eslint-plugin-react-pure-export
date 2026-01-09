/**
 * @fileoverview ESLint plugin to enforce separation between React components and pure logic modules
 * @author eslint-plugin-react-pure-export
 */

'use strict';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// Import all rules
const noNonComponentExportInTsx = require('./rules/no-non-component-export-in-tsx');
const noTsxImportInPureModule = require('./rules/no-tsx-import-in-pure-module');
const noHeavyDepsInPureModule = require('./rules/no-heavy-deps-in-pure-module');

// Plugin definition
const plugin = {
    rules: {
        'no-non-component-export-in-tsx': noNonComponentExportInTsx,
        'no-tsx-import-in-pure-module': noTsxImportInPureModule,
        'no-heavy-deps-in-pure-module': noHeavyDepsInPureModule,
    },
    configs: {
    // Legacy Config format (ESLint 8 and below)
        recommended: {
            plugins: ['react-pure-export'],
            rules: {
                'react-pure-export/no-non-component-export-in-tsx': 'error',
                'react-pure-export/no-tsx-import-in-pure-module': 'error',
                'react-pure-export/no-heavy-deps-in-pure-module': 'error',
            },
        },
    },
};

// Add flat/recommended config after plugin is defined to avoid circular reference
plugin.configs['flat/recommended'] = {
    plugins: {
        'react-pure-export': plugin,
    },
    rules: {
        'react-pure-export/no-non-component-export-in-tsx': 'error',
        'react-pure-export/no-tsx-import-in-pure-module': 'error',
        'react-pure-export/no-heavy-deps-in-pure-module': 'error',
    },
};

module.exports = plugin;
