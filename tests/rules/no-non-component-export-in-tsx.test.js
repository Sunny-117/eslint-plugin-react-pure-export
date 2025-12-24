/**
 * Tests for no-non-component-export-in-tsx rule
 * Validates: Requirements 1.2, 1.3, 1.4
 */

const { ESLint } = require('eslint');
const path = require('path');

console.log('🧪 Testing no-non-component-export-in-tsx rule...\n');

/**
 * Create ESLint instance with the rule enabled
 */
function createESLint() {
  return new ESLint({
    useEslintrc: false,
    baseConfig: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      plugins: ['react-pure-export'],
      rules: {
        'react-pure-export/no-non-component-export-in-tsx': 'error'
      }
    },
    plugins: {
      'react-pure-export': require('../../lib/index')
    }
  });
}

/**
 * Test helper to lint code
 */
async function lintCode(code, filePath) {
  const eslint = createESLint();
  const results = await eslint.lintText(code, { filePath });
  return results[0];
}

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  console.log('📋 Testing rule only applies to .tsx files:\n');
  
  // Test 1: Rule should not apply to .ts files
  try {
    const code1 = 'export const PAGE_SIZE = 20;';
    const result1 = await lintCode(code1, 'test.ts');
    if (result1.messages.length === 0) {
      console.log('✅ PASS: Rule does not apply to .ts files');
      passed++;
    } else {
      console.log('❌ FAIL: Rule should not apply to .ts files');
      console.log('  Messages:', result1.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .ts file:', e.message);
    failed++;
  }
  
  // Test 2: Rule should apply to .tsx files
  try {
    const code2 = 'export const PAGE_SIZE = 20;';
    const result2 = await lintCode(code2, 'test.tsx');
    if (result2.messages.length > 0) {
      console.log('✅ PASS: Rule applies to .tsx files');
      passed++;
    } else {
      console.log('❌ FAIL: Rule should apply to .tsx files');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .tsx file:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing non-component exports are rejected:\n');
  
  // Test 3: Non-component const export should error
  try {
    const code3 = 'export const PAGE_SIZE = 20;';
    const result3 = await lintCode(code3, 'test.tsx');
    if (result3.messages.length > 0 && 
        result3.messages[0].messageId === 'nonComponentExport') {
      console.log('✅ PASS: Non-component const export triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Non-component const export should trigger error');
      console.log('  Messages:', result3.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing const export:', e.message);
    failed++;
  }
  
  // Test 4: Non-component function export should error
  try {
    const code4 = 'export function helper() { return 42; }';
    const result4 = await lintCode(code4, 'test.tsx');
    if (result4.messages.length > 0 && 
        result4.messages[0].messageId === 'nonComponentExport') {
      console.log('✅ PASS: Non-component function export triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Non-component function export should trigger error');
      console.log('  Messages:', result4.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing function export:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing React components are allowed:\n');
  
  // Test 5: React.FC component should not error
  try {
    const code5 = `
      import React from 'react';
      export const Home: React.FC = () => <div>Home</div>;
    `;
    const result5 = await lintCode(code5, 'test.tsx');
    if (result5.messages.length === 0) {
      console.log('✅ PASS: React.FC component does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: React.FC component should not trigger error');
      console.log('  Messages:', result5.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing React.FC component:', e.message);
    failed++;
  }
  
  // Test 6: React.memo component should not error
  try {
    const code6 = `
      import React from 'react';
      export const Home = React.memo(() => <div>Home</div>);
    `;
    const result6 = await lintCode(code6, 'test.tsx');
    if (result6.messages.length === 0) {
      console.log('✅ PASS: React.memo component does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: React.memo component should not trigger error');
      console.log('  Messages:', result6.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing React.memo component:', e.message);
    failed++;
  }
  
  // Test 7: React.forwardRef component should not error
  try {
    const code7 = `
      import React from 'react';
      export const Home = React.forwardRef((props, ref) => <div ref={ref}>Home</div>);
    `;
    const result7 = await lintCode(code7, 'test.tsx');
    if (result7.messages.length === 0) {
      console.log('✅ PASS: React.forwardRef component does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: React.forwardRef component should not trigger error');
      console.log('  Messages:', result7.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing React.forwardRef component:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing type exports are allowed:\n');
  
  // Test 8: Type export should not error
  try {
    const code8 = 'export type Status = "active" | "inactive";';
    const result8 = await lintCode(code8, 'test.tsx');
    if (result8.messages.length === 0) {
      console.log('✅ PASS: Type export does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Type export should not trigger error');
      console.log('  Messages:', result8.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing type export:', e.message);
    failed++;
  }
  
  // Test 9: Interface export should not error
  try {
    const code9 = 'export interface User { name: string; }';
    const result9 = await lintCode(code9, 'test.tsx');
    if (result9.messages.length === 0) {
      console.log('✅ PASS: Interface export does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Interface export should not trigger error');
      console.log('  Messages:', result9.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing interface export:', e.message);
    failed++;
  }
  
  // Test 10: Const enum should not error
  try {
    const code10 = 'export const enum Status { Active, Inactive }';
    const result10 = await lintCode(code10, 'test.tsx');
    if (result10.messages.length === 0) {
      console.log('✅ PASS: Const enum does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Const enum should not trigger error');
      console.log('  Messages:', result10.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing const enum:', e.message);
    failed++;
  }
  
  // Summary
  const total = passed + failed;
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`📈 SUMMARY: ${passed}/${total} tests passed`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  return { passed, failed };
}

runTests().then(result => {
  const { passed, failed } = result;
  if (failed === 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Test execution failed:', err);
  process.exit(1);
});
