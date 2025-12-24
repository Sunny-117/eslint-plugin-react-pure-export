// This file sets up the local plugin for ESLint (Legacy Config format)
// We need to make the plugin available to ESLint by manipulating the module resolution

// Load the plugin
const plugin = require('../lib/index.js');

// Make it available as if it were installed as a package
const Module = require('module');
const originalResolve = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain) {
  if (request === 'eslint-plugin-react-pure-export') {
    return require.resolve('../lib/index.js');
  }
  return originalResolve.call(this, request, parent, isMain);
};

module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react-pure-export'],
  rules: {
    // Enable all three rules from the plugin
    'react-pure-export/no-non-component-export-in-tsx': 'error',
    'react-pure-export/no-tsx-import-in-pure-module': 'error',
    'react-pure-export/no-heavy-deps-in-pure-module': 'error'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
