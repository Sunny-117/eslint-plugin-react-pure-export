/**
 * Tests for no-tsx-import-in-pure-module rule
 * Validates: Requirements 2.4, 2.5
 */

const { ESLint } = require('eslint');

console.log('🧪 Testing no-tsx-import-in-pure-module rule...\n');

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
        sourceType: 'module'
      },
      plugins: ['react-pure-export'],
      rules: {
        'react-pure-export/no-tsx-import-in-pure-module': 'error'
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
  
  console.log('📋 Testing rule only applies to pure module files:\n');
  
  // Test 1: Rule should not apply to regular .ts files
  try {
    const code1 = 'import { Component } from "./Component.tsx";';
    const result1 = await lintCode(code1, 'regular.ts');
    if (result1.messages.length === 0) {
      console.log('✅ PASS: Rule does not apply to regular .ts files');
      passed++;
    } else {
      console.log('❌ FAIL: Rule should not apply to regular .ts files');
      console.log('  Messages:', result1.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing regular .ts file:', e.message);
    failed++;
  }
  
  // Test 2: Rule should apply to *.pure.ts files
  try {
    const code2 = 'import { Component } from "./Component.tsx";';
    const result2 = await lintCode(code2, 'helpers.pure.ts');
    if (result2.messages.length > 0) {
      console.log('✅ PASS: Rule applies to *.pure.ts files');
      passed++;
    } else {
      console.log('❌ FAIL: Rule should apply to *.pure.ts files');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing *.pure.ts file:', e.message);
    failed++;
  }
  
  // Test 3: Rule should apply to *.utils.ts files
  try {
    const code3 = 'import { Component } from "./Component.tsx";';
    const result3 = await lintCode(code3, 'helpers.utils.ts');
    if (result3.messages.length > 0) {
      console.log('✅ PASS: Rule applies to *.utils.ts files');
      passed++;
    } else {
      console.log('❌ FAIL: Rule should apply to *.utils.ts files');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing *.utils.ts file:', e.message);
    failed++;
  }
  
  // Test 4: Rule should apply to *.config.ts files
  try {
    const code4 = 'import { Component } from "./Component.tsx";';
    const result4 = await lintCode(code4, 'app.config.ts');
    if (result4.messages.length > 0) {
      console.log('✅ PASS: Rule applies to *.config.ts files');
      passed++;
    } else {
      console.log('❌ FAIL: Rule should apply to *.config.ts files');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing *.config.ts file:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing .tsx imports are rejected:\n');
  
  // Test 5: Import .tsx file should error
  try {
    const code5 = 'import { Component } from "./Component.tsx";';
    const result5 = await lintCode(code5, 'helpers.pure.ts');
    if (result5.messages.length > 0 && 
        result5.messages[0].messageId === 'tsxImportInPureModule') {
      console.log('✅ PASS: Import .tsx file triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Import .tsx file should trigger error');
      console.log('  Messages:', result5.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .tsx import:', e.message);
    failed++;
  }
  
  // Test 6: Import .tsx file with relative path should error
  try {
    const code6 = 'import { Component } from "../components/Component.tsx";';
    const result6 = await lintCode(code6, 'utils/helpers.pure.ts');
    if (result6.messages.length > 0 && 
        result6.messages[0].messageId === 'tsxImportInPureModule') {
      console.log('✅ PASS: Import .tsx file with relative path triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Import .tsx file with relative path should trigger error');
      console.log('  Messages:', result6.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .tsx import with relative path:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing non-.tsx imports are allowed:\n');
  
  // Test 7: Import .ts file should not error
  try {
    const code7 = 'import { helper } from "./helper.ts";';
    const result7 = await lintCode(code7, 'helpers.pure.ts');
    if (result7.messages.length === 0) {
      console.log('✅ PASS: Import .ts file does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Import .ts file should not trigger error');
      console.log('  Messages:', result7.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .ts import:', e.message);
    failed++;
  }
  
  // Test 8: Import .js file should not error
  try {
    const code8 = 'import { helper } from "./helper.js";';
    const result8 = await lintCode(code8, 'helpers.pure.ts');
    if (result8.messages.length === 0) {
      console.log('✅ PASS: Import .js file does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Import .js file should not trigger error');
      console.log('  Messages:', result8.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .js import:', e.message);
    failed++;
  }
  
  // Test 9: Import npm package should not error
  try {
    const code9 = 'import { useState } from "react";';
    const result9 = await lintCode(code9, 'helpers.pure.ts');
    if (result9.messages.length === 0) {
      console.log('✅ PASS: Import npm package does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Import npm package should not trigger error');
      console.log('  Messages:', result9.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing npm package import:', e.message);
    failed++;
  }
  
  // Test 10: Import without extension should not error
  try {
    const code10 = 'import { helper } from "./helper";';
    const result10 = await lintCode(code10, 'helpers.pure.ts');
    if (result10.messages.length === 0) {
      console.log('✅ PASS: Import without extension does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Import without extension should not trigger error');
      console.log('  Messages:', result10.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing import without extension:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing error message content:\n');
  
  // Test 11: Error message should contain "pure module should not depend on tsx"
  try {
    const code11 = 'import { Component } from "./Component.tsx";';
    const result11 = await lintCode(code11, 'helpers.pure.ts');
    if (result11.messages.length > 0) {
      const message = result11.messages[0].message;
      if (message.includes('Pure module') && 
          message.includes('should not depend') && 
          message.includes('.tsx')) {
        console.log('✅ PASS: Error message contains expected text');
        passed++;
      } else {
        console.log('❌ FAIL: Error message should contain "pure module should not depend on tsx"');
        console.log('  Actual message:', message);
        failed++;
      }
    } else {
      console.log('❌ FAIL: Should have error message');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing error message:', e.message);
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
