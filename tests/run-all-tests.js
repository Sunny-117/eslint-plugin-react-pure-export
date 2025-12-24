#!/usr/bin/env node

/**
 * Test runner that executes all unit tests and property tests
 */

const { spawn } = require('child_process');
const path = require('path');

// All test files to run
const testFiles = [
  // Utils tests
  'tests/utils/file-pattern-matcher.test.js',
  'tests/utils/ast-helpers.test.js',
  'tests/utils/react-component-detector.test.js',
  
  // Rule unit tests
  'tests/rules/no-non-component-export-in-tsx.test.js',
  'tests/rules/no-non-component-export-in-tsx.fixer.test.js',
  'tests/rules/no-tsx-import-in-pure-module.test.js',
  'tests/rules/no-heavy-deps-in-pure-module.test.js',
  
  // Rule property tests
  'tests/rules/no-non-component-export-in-tsx.property.test.js',
  'tests/rules/no-tsx-import-in-pure-module.property.test.js',
  'tests/rules/no-heavy-deps-in-pure-module.property.test.js',
  
  // Integration tests
  'tests/integration/plugin-entry.test.js',
  'tests/integration/plugin-entry.property.test.js'
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function runTest(testFile) {
  return new Promise((resolve) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Running: ${testFile}`);
    console.log('='.repeat(80));
    
    const child = spawn('node', [testFile], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        passedTests++;
        console.log(`✅ ${testFile} PASSED`);
      } else {
        failedTests++;
        console.log(`❌ ${testFile} FAILED`);
      }
      totalTests++;
      resolve(code);
    });
  });
}

async function runAllTests() {
  console.log('🧪 Running all tests for eslint-plugin-react-pure-export\n');
  
  const startTime = Date.now();
  
  for (const testFile of testFiles) {
    await runTest(testFile);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 Test Summary');
  console.log('='.repeat(80));
  console.log(`Total test files: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Duration: ${duration}s`);
  
  if (failedTests === 0) {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } else {
    console.log(`\n❌ ${failedTests} test file(s) failed`);
    process.exit(1);
  }
}

runAllTests().catch((error) => {
  console.error('Error running tests:', error);
  process.exit(1);
});
