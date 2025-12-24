#!/usr/bin/env node

/**
 * Verification script for playground rule behavior
 * This script runs ESLint on specific files and verifies expected errors
 */

const { ESLint } = require('eslint');
const path = require('path');

// Setup module resolution for local plugin
const Module = require('module');
const originalResolve = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain) {
  if (request === 'eslint-plugin-react-pure-export') {
    return require.resolve('../lib/index.js');
  }
  return originalResolve.call(this, request, parent, isMain);
};

async function verifyFile(filePath, expectedErrors) {
  const eslint = new ESLint({
    useEslintrc: false,
    baseConfig: {
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
        'react-pure-export/no-non-component-export-in-tsx': 'error',
        'react-pure-export/no-tsx-import-in-pure-module': 'error',
        'react-pure-export/no-heavy-deps-in-pure-module': 'error'
      }
    }
  });

  const results = await eslint.lintFiles([filePath]);
  const messages = results[0].messages;
  
  console.log(`\n📄 File: ${path.basename(filePath)}`);
  console.log(`   Expected errors: ${expectedErrors.length}`);
  console.log(`   Actual errors: ${messages.length}`);
  
  if (messages.length === 0) {
    console.log('   ✅ No errors found');
  } else {
    console.log('   Errors found:');
    messages.forEach((msg, idx) => {
      console.log(`   ${idx + 1}. Line ${msg.line}: ${msg.message}`);
      console.log(`      Rule: ${msg.ruleId}`);
    });
  }
  
  // Check if actual errors match expected
  let passed = true;
  
  if (messages.length !== expectedErrors.length) {
    console.log(`   ⚠️  Error count mismatch!`);
    passed = false;
  }
  
  // Check if expected error patterns are present
  expectedErrors.forEach((expectedPattern, idx) => {
    const found = messages.some(msg => {
      if (expectedPattern.rule) {
        return msg.ruleId === expectedPattern.rule;
      }
      if (expectedPattern.test) {
        return expectedPattern.test(msg.message);
      }
      return false;
    });
    
    if (!found) {
      console.log(`   ❌ Expected error not found: ${expectedPattern.rule || expectedPattern}`);
      passed = false;
    }
  });
  
  return passed;
}

async function main() {
  console.log('🧪 Verifying playground rule behavior...\n');
  console.log('=' .repeat(60));
  
  const tests = [
    {
      file: 'src/components/ValidComponent.tsx',
      expectedErrors: []  // Should have NO errors
    },
    {
      file: 'src/components/InvalidComponent.tsx',
      expectedErrors: [
        { rule: 'react-pure-export/no-non-component-export-in-tsx' }, // PAGE_SIZE
        { rule: 'react-pure-export/no-non-component-export-in-tsx' }, // calculateTotal
        { rule: 'react-pure-export/no-non-component-export-in-tsx' }, // UserRole enum
        { rule: 'react-pure-export/no-non-component-export-in-tsx' }  // API_URL
      ]
    },
    {
      file: 'src/utils/invalid.pure.ts',
      expectedErrors: [
        { rule: 'react-pure-export/no-tsx-import-in-pure-module' }, // import ValidFC
        { rule: 'react-pure-export/no-tsx-import-in-pure-module' }  // import type ValidProps
      ]
    }
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    const filePath = path.join(__dirname, test.file);
    const passed = await verifyFile(filePath, test.expectedErrors);
    
    if (!passed) {
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (allPassed) {
    console.log('✅ All verifications passed!');
    process.exit(0);
  } else {
    console.log('❌ Some verifications failed!');
    console.log('\nNote: Check if the errors are acceptable or if the implementation needs adjustment.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
