/**
 * Tests for no-heavy-deps-in-pure-module rule
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8
 */

const { ESLint } = require('eslint');

console.log('🧪 Testing no-heavy-deps-in-pure-module rule...\n');

/**
 * Create ESLint instance with the rule enabled
 */
function createESLint(options = {}) {
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
        'react-pure-export/no-heavy-deps-in-pure-module': ['error', options]
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
async function lintCode(code, filePath, options = {}) {
  const eslint = createESLint(options);
  const results = await eslint.lintText(code, { filePath });
  return results[0];
}

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  console.log('📋 Testing rule only applies to pure module files:\n');
  
  // Test 1: Rule should not apply to regular .ts files
  try {
    const code1 = 'import React from "react";';
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
    const code2 = 'import React from "react";';
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
  
  console.log('\n📋 Testing default forbidden dependencies:\n');
  
  // Test 3: Import react should error
  try {
    const code3 = 'import React from "react";';
    const result3 = await lintCode(code3, 'helpers.pure.ts');
    if (result3.messages.length > 0 && 
        result3.messages[0].messageId === 'heavyDepInPureModule') {
      console.log('✅ PASS: Import react triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Import react should trigger error');
      console.log('  Messages:', result3.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing react import:', e.message);
    failed++;
  }
  
  // Test 4: Import react-dom should error
  try {
    const code4 = 'import ReactDOM from "react-dom";';
    const result4 = await lintCode(code4, 'helpers.pure.ts');
    if (result4.messages.length > 0 && 
        result4.messages[0].messageId === 'heavyDepInPureModule') {
      console.log('✅ PASS: Import react-dom triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Import react-dom should trigger error');
      console.log('  Messages:', result4.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing react-dom import:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing default forbidden extensions:\n');
  
  // Test 5: Import .css file should error
  try {
    const code5 = 'import "./styles.css";';
    const result5 = await lintCode(code5, 'helpers.pure.ts');
    if (result5.messages.length > 0 && 
        result5.messages[0].messageId === 'heavyDepInPureModule') {
      console.log('✅ PASS: Import .css file triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Import .css file should trigger error');
      console.log('  Messages:', result5.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .css import:', e.message);
    failed++;
  }
  
  // Test 6: Import .less file should error
  try {
    const code6 = 'import "./styles.less";';
    const result6 = await lintCode(code6, 'helpers.pure.ts');
    if (result6.messages.length > 0 && 
        result6.messages[0].messageId === 'heavyDepInPureModule') {
      console.log('✅ PASS: Import .less file triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Import .less file should trigger error');
      console.log('  Messages:', result6.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .less import:', e.message);
    failed++;
  }
  
  // Test 7: Import .scss file should error
  try {
    const code7 = 'import "./styles.scss";';
    const result7 = await lintCode(code7, 'helpers.pure.ts');
    if (result7.messages.length > 0 && 
        result7.messages[0].messageId === 'heavyDepInPureModule') {
      console.log('✅ PASS: Import .scss file triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Import .scss file should trigger error');
      console.log('  Messages:', result7.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .scss import:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing custom configuration:\n');
  
  // Test 8: Custom forbidden dependencies should be respected
  try {
    const code8 = 'import axios from "axios";';
    const options8 = { forbiddenDeps: ['axios', 'lodash'] };
    const result8 = await lintCode(code8, 'helpers.pure.ts', options8);
    if (result8.messages.length > 0 && 
        result8.messages[0].messageId === 'heavyDepInPureModule') {
      console.log('✅ PASS: Custom forbidden dependencies are respected');
      passed++;
    } else {
      console.log('❌ FAIL: Custom forbidden dependencies should be respected');
      console.log('  Messages:', result8.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing custom forbidden deps:', e.message);
    failed++;
  }
  
  // Test 9: Custom forbidden extensions should be respected
  try {
    const code9 = 'import "./image.png";';
    const options9 = { forbiddenExtensions: ['.png', '.jpg'] };
    const result9 = await lintCode(code9, 'helpers.pure.ts', options9);
    if (result9.messages.length > 0 && 
        result9.messages[0].messageId === 'heavyDepInPureModule') {
      console.log('✅ PASS: Custom forbidden extensions are respected');
      passed++;
    } else {
      console.log('❌ FAIL: Custom forbidden extensions should be respected');
      console.log('  Messages:', result9.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing custom forbidden extensions:', e.message);
    failed++;
  }
  
  // Test 10: Empty configuration should use defaults
  try {
    const code10 = 'import React from "react";';
    const options10 = {};
    const result10 = await lintCode(code10, 'helpers.pure.ts', options10);
    if (result10.messages.length > 0 && 
        result10.messages[0].messageId === 'heavyDepInPureModule') {
      console.log('✅ PASS: Empty configuration uses default values');
      passed++;
    } else {
      console.log('❌ FAIL: Empty configuration should use default values');
      console.log('  Messages:', result10.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing empty configuration:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing allowed imports:\n');
  
  // Test 11: Import allowed npm package should not error
  try {
    const code11 = 'import { format } from "date-fns";';
    const result11 = await lintCode(code11, 'helpers.pure.ts');
    if (result11.messages.length === 0) {
      console.log('✅ PASS: Import allowed npm package does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Import allowed npm package should not trigger error');
      console.log('  Messages:', result11.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing allowed npm package:', e.message);
    failed++;
  }
  
  // Test 12: Import .ts file should not error
  try {
    const code12 = 'import { helper } from "./helper.ts";';
    const result12 = await lintCode(code12, 'helpers.pure.ts');
    if (result12.messages.length === 0) {
      console.log('✅ PASS: Import .ts file does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Import .ts file should not trigger error');
      console.log('  Messages:', result12.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .ts import:', e.message);
    failed++;
  }
  
  // Test 13: Import .json file should not error
  try {
    const code13 = 'import config from "./config.json";';
    const result13 = await lintCode(code13, 'helpers.pure.ts');
    if (result13.messages.length === 0) {
      console.log('✅ PASS: Import .json file does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Import .json file should not trigger error');
      console.log('  Messages:', result13.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .json import:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing error message content:\n');
  
  // Test 14: Error message should contain expected text
  try {
    const code14 = 'import React from "react";';
    const result14 = await lintCode(code14, 'helpers.pure.ts');
    if (result14.messages.length > 0) {
      const message = result14.messages[0].message;
      if (message.includes('Pure module') && 
          message.includes('should not import') && 
          message.includes('heavy dependency')) {
        console.log('✅ PASS: Error message contains expected text');
        passed++;
      } else {
        console.log('❌ FAIL: Error message should contain expected text');
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
