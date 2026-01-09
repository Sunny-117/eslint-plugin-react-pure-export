/**
 * Tests for no-non-component-export-in-tsx rule - Destructuring cases
 * Tests object and array destructuring in exports
 */

const { ESLint } = require('eslint');

console.log('🧪 Testing no-non-component-export-in-tsx rule - Destructuring...\n');

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
  
  console.log('📋 Testing object destructuring exports:\n');
  
  // Test 1: Object destructuring with multiple exports
  try {
    const code1 = `
      function getConfig() { return { a: 1, b: 2 }; }
      export const { a, b } = getConfig();
    `;
    const result1 = await lintCode(code1, 'test.tsx');
    
    // Should have 2 errors, one for each destructured variable
    if (result1.messages.length === 2) {
      const hasErrorForA = result1.messages.some(msg => msg.message.includes('"a"'));
      const hasErrorForB = result1.messages.some(msg => msg.message.includes('"b"'));
      
      if (hasErrorForA && hasErrorForB) {
        console.log('✅ PASS: Object destructuring reports error for each variable');
        passed++;
      } else {
        console.log('❌ FAIL: Object destructuring should report error for both a and b');
        console.log('  Messages:', result1.messages.map(m => m.message));
        failed++;
      }
    } else {
      console.log('❌ FAIL: Object destructuring should report 2 errors');
      console.log('  Found:', result1.messages.length, 'errors');
      console.log('  Messages:', result1.messages.map(m => m.message));
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing object destructuring:', e.message);
    failed++;
  }
  
  // Test 2: Object destructuring with renamed properties
  try {
    const code2 = `
      function getConfig() { return { x: 1, y: 2 }; }
      export const { x: newX, y: newY } = getConfig();
    `;
    const result2 = await lintCode(code2, 'test.tsx');
    
    if (result2.messages.length === 2) {
      console.log('✅ PASS: Object destructuring with rename reports errors');
      passed++;
    } else {
      console.log('❌ FAIL: Object destructuring with rename should report 2 errors');
      console.log('  Found:', result2.messages.length, 'errors');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing renamed destructuring:', e.message);
    failed++;
  }
  
  // Test 3: Real-world example from runtime.tsx
  try {
    const code3 = `
      function getConfigFromDataSource(c: any): any {}
      export enum CreativeType {
          'IMAGE' = 1,
          'VIDEO' = 2,
      }
      
      const CreativeDataSource = [
          [CreativeType.IMAGE, 'IMAGE', '图片'],
          [CreativeType.VIDEO, 'VIDEO', '视频'],
      ] as const;
      
      export const {
          dataSource: CreativeTypeDataSource,
          nameMapByValue: CreativeTypeNameMapByValue,
      } = getConfigFromDataSource(CreativeDataSource);
      
      export function withLinter() {
          console.log('with linter')
      }
    `;
    const result3 = await lintCode(code3, 'test.tsx');
    
    // Should have 4 errors: enum, 2 destructured vars, function
    if (result3.messages.length === 4) {
      const hasEnumError = result3.messages.some(msg => msg.message.includes('CreativeType'));
      const hasDataSourceError = result3.messages.some(msg => msg.message.includes('CreativeTypeDataSource'));
      const hasNameMapError = result3.messages.some(msg => msg.message.includes('CreativeTypeNameMapByValue'));
      const hasFunctionError = result3.messages.some(msg => msg.message.includes('withLinter'));
      
      if (hasEnumError && hasDataSourceError && hasNameMapError && hasFunctionError) {
        console.log('✅ PASS: Real-world example detects all 4 exports');
        passed++;
      } else {
        console.log('❌ FAIL: Real-world example should detect all exports');
        console.log('  Enum:', hasEnumError);
        console.log('  DataSource:', hasDataSourceError);
        console.log('  NameMap:', hasNameMapError);
        console.log('  Function:', hasFunctionError);
        console.log('  Messages:', result3.messages.map(m => m.message));
        failed++;
      }
    } else {
      console.log('❌ FAIL: Real-world example should report 4 errors');
      console.log('  Found:', result3.messages.length, 'errors');
      console.log('  Messages:', result3.messages.map(m => m.message));
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing real-world example:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing array destructuring exports:\n');
  
  // Test 4: Array destructuring
  try {
    const code4 = `
      function getArray() { return [1, 2, 3]; }
      export const [first, second] = getArray();
    `;
    const result4 = await lintCode(code4, 'test.tsx');
    
    if (result4.messages.length === 2) {
      console.log('✅ PASS: Array destructuring reports error for each variable');
      passed++;
    } else {
      console.log('❌ FAIL: Array destructuring should report 2 errors');
      console.log('  Found:', result4.messages.length, 'errors');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing array destructuring:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing mixed cases:\n');
  
  // Test 5: Simple export should still work
  try {
    const code5 = `export const PAGE_SIZE = 20;`;
    const result5 = await lintCode(code5, 'test.tsx');
    
    if (result5.messages.length === 1) {
      console.log('✅ PASS: Simple export still works correctly');
      passed++;
    } else {
      console.log('❌ FAIL: Simple export should report 1 error');
      console.log('  Found:', result5.messages.length, 'errors');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing simple export:', e.message);
    failed++;
  }
  
  // Test 6: React component should not error
  try {
    const code6 = `
      import React from 'react';
      export const Button: React.FC = () => <button>Click</button>;
    `;
    const result6 = await lintCode(code6, 'test.tsx');
    
    if (result6.messages.length === 0) {
      console.log('✅ PASS: React component does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: React component should not trigger error');
      console.log('  Messages:', result6.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing React component:', e.message);
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
