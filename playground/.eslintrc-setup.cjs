// This file sets up the local plugin for ESLint
const plugin = require('../lib/index.js');

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
  plugins: {
    'react-pure-export': plugin
  },
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
