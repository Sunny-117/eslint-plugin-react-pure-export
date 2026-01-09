/**
 * Tests for no-tsx-import-in-pure-module rule with custom configuration
 * Tests the new default behavior (only .ts files) and custom patterns
 */

const { ESLint } = require('eslint');

console.log('🧪 Testing no-tsx-import-in-pure-module rule with configuration...\n');

/**
 * Create ESLint instance with custom rule configuration
 */
function createESLint(ruleConfig = 'error') {
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
        'react-pure-export/no-tsx-import-in-pure-module': ruleConfig
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
async function lintCode(code, filePath, ruleConfig = 'error') {
  const eslint = createESLint(ruleConfig);
  const results = await eslint.lintText(code, { filePath });
  return results[0];
}

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  console.log('📋 Testing default behavior (all .ts files are pure modules):\n');
  
  // Test 1: Regular .ts file should be treated as pure module
  try {
    const code1 = 'import { Component } from "./Component.tsx";';
    const result1 = await lintCode(code1, 'helpers.ts');
    if (result1.messages.length > 0) {
      console.log('✅ PASS: .ts file is treated as pure module by default');
      passed++;
    } else {
      console.log('❌ FAIL: .ts file should be treated as pure module by default');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .ts file:', e.message);
    failed++;
  }
  
  // Test 2: .pure.ts file should ALSO be treated as pure module by default
  try {
    const code2 = 'import { Component } from "./Component.tsx";';
    const result2 = await lintCode(code2, 'helpers.pure.ts');
    if (result2.messages.length > 0) {
      console.log('✅ PASS: .pure.ts file is treated as pure module by default');
      passed++;
    } else {
      console.log('❌ FAIL: .pure.ts file should be treated as pure module by default');
      console.log('  Messages:', result2.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .pure.ts file:', e.message);
    failed++;
  }
  
  // Test 3: .utils.ts file should ALSO be treated as pure module by default
  try {
    const code3 = 'import { Component } from "./Component.tsx";';
    const result3 = await lintCode(code3, 'helpers.utils.ts');
    if (result3.messages.length > 0) {
      console.log('✅ PASS: .utils.ts file is treated as pure module by default');
      passed++;
    } else {
      console.log('❌ FAIL: .utils.ts file should be treated as pure module by default');
      console.log('  Messages:', result3.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .utils.ts file:', e.message);
    failed++;
  }
  
  // Test 4: .config.ts file should ALSO be treated as pure module by default
  try {
    const code4 = 'import { Component } from "./Component.tsx";';
    const result4 = await lintCode(code4, 'app.config.ts');
    if (result4.messages.length > 0) {
      console.log('✅ PASS: .config.ts file is treated as pure module by default');
      passed++;
    } else {
      console.log('❌ FAIL: .config.ts file should be treated as pure module by default');
      console.log('  Messages:', result4.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .config.ts file:', e.message);
    failed++;
  }
  
  // Test 5: .tsx file should NOT be treated as pure module
  try {
    const code5 = 'import { Component } from "./Component.tsx";';
    const result5 = await lintCode(code5, 'Component.tsx');
    if (result5.messages.length === 0) {
      console.log('✅ PASS: .tsx file is NOT treated as pure module');
      passed++;
    } else {
      console.log('❌ FAIL: .tsx file should NOT be treated as pure module');
      console.log('  Messages:', result5.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing .tsx file:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing custom patterns configuration:\n');
  
  // Test 6: Custom pattern *.pure.ts should work
  try {
    const code6 = 'import { Component } from "./Component.tsx";';
    const ruleConfig6 = ['error', { pureModulePatterns: ['*.pure.ts'] }];
    const result6 = await lintCode(code6, 'helpers.pure.ts', ruleConfig6);
    if (result6.messages.length > 0) {
      console.log('✅ PASS: Custom pattern *.pure.ts works');
      passed++;
    } else {
      console.log('❌ FAIL: Custom pattern *.pure.ts should work');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing custom pattern:', e.message);
    failed++;
  }
  
  // Test 7: Custom pattern *.utils.ts should work
  try {
    const code7 = 'import { Component } from "./Component.tsx";';
    const ruleConfig7 = ['error', { pureModulePatterns: ['*.utils.ts'] }];
    const result7 = await lintCode(code7, 'helpers.utils.ts', ruleConfig7);
    if (result7.messages.length > 0) {
      console.log('✅ PASS: Custom pattern *.utils.ts works');
      passed++;
    } else {
      console.log('❌ FAIL: Custom pattern *.utils.ts should work');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing custom pattern:', e.message);
    failed++;
  }
  
  // Test 8: Multiple custom patterns should work
  try {
    const code8a = 'import { Component } from "./Component.tsx";';
    const code8b = 'import { Component } from "./Component.tsx";';
    const ruleConfig8 = ['error', { pureModulePatterns: ['*.pure.ts', '*.utils.ts', '*.config.ts'] }];
    const result8a = await lintCode(code8a, 'helpers.pure.ts', ruleConfig8);
    const result8b = await lintCode(code8b, 'helpers.utils.ts', ruleConfig8);
    if (result8a.messages.length > 0 && result8b.messages.length > 0) {
      console.log('✅ PASS: Multiple custom patterns work');
      passed++;
    } else {
      console.log('❌ FAIL: Multiple custom patterns should work');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing multiple custom patterns:', e.message);
    failed++;
  }
  
  // Test 9: Custom pattern should not affect .ts files when not included
  try {
    const code9 = 'import { Component } from "./Component.tsx";';
    const ruleConfig9 = ['error', { pureModulePatterns: ['*.pure.ts'] }];
    const result9 = await lintCode(code9, 'helpers.ts', ruleConfig9);
    if (result9.messages.length === 0) {
      console.log('✅ PASS: Custom pattern does not affect .ts files when not included');
      passed++;
    } else {
      console.log('❌ FAIL: Custom pattern should not affect .ts files when not included');
      console.log('  Messages:', result9.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing custom pattern exclusion:', e.message);
    failed++;
  }
  
  // Test 10: Including *.ts in custom patterns should work
  try {
    const code10 = 'import { Component } from "./Component.tsx";';
    const ruleConfig10 = ['error', { pureModulePatterns: ['*.ts', '*.pure.ts'] }];
    const result10 = await lintCode(code10, 'helpers.ts', ruleConfig10);
    if (result10.messages.length > 0) {
      console.log('✅ PASS: Including *.ts in custom patterns works');
      passed++;
    } else {
      console.log('❌ FAIL: Including *.ts in custom patterns should work');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing *.ts in custom patterns:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing edge cases:\n');
  
  // Test 11: Empty custom patterns should use default (*.ts)
  try {
    const code11 = 'import { Component } from "./Component.tsx";';
    const ruleConfig11 = ['error', { pureModulePatterns: [] }];
    const result11 = await lintCode(code11, 'helpers.ts', ruleConfig11);
    if (result11.messages.length > 0) {
      console.log('✅ PASS: Empty custom patterns uses default (*.ts)');
      passed++;
    } else {
      console.log('❌ FAIL: Empty custom patterns should use default (*.ts)');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing empty custom patterns:', e.message);
    failed++;
  }
  
  // Test 12: Nested path should work with patterns
  try {
    const code12 = 'import { Component } from "./Component.tsx";';
    const result12 = await lintCode(code12, 'src/utils/helpers.ts');
    if (result12.messages.length > 0) {
      console.log('✅ PASS: Nested path works with patterns');
      passed++;
    } else {
      console.log('❌ FAIL: Nested path should work with patterns');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing nested path:', e.message);
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
    console.log('✅ All configuration tests passed!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Test execution failed:', err);
  process.exit(1);
});
