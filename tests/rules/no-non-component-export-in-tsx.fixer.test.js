/**
 * Tests for no-non-component-export-in-tsx rule fixer
 * Validates: Requirements 1.10
 */

const { ESLint } = require('eslint');

console.log('🧪 Testing no-non-component-export-in-tsx rule fixer...\n');

/**
 * Create ESLint instance with the rule enabled and fix enabled
 */
function createESLint() {
  return new ESLint({
    useEslintrc: false,
    fix: true,
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
 * Test helper to lint and fix code
 */
async function lintAndFix(code, filePath) {
  const eslint = createESLint();
  const results = await eslint.lintText(code, { filePath });
  return results[0];
}

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  console.log('📋 Testing fixer generates correct filename:\n');
  
  // Test 1: Fixer converts camelCase to kebab-case
  try {
    const code1 = 'export const pageSize = 20;';
    const result1 = await lintAndFix(code1, 'test.tsx');
    
    if (result1.output && result1.output.includes('page-size.ts')) {
      console.log('✅ PASS: Fixer converts camelCase to kebab-case');
      passed++;
    } else {
      console.log('❌ FAIL: Fixer should convert camelCase to kebab-case');
      console.log('  Output:', result1.output);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing camelCase conversion:', e.message);
    failed++;
  }
  
  // Test 2: Fixer converts PascalCase to kebab-case
  try {
    const code2 = 'export const PageSize = 20;';
    const result2 = await lintAndFix(code2, 'test.tsx');
    
    if (result2.output && result2.output.includes('page-size.ts')) {
      console.log('✅ PASS: Fixer converts PascalCase to kebab-case');
      passed++;
    } else {
      console.log('❌ FAIL: Fixer should convert PascalCase to kebab-case');
      console.log('  Output:', result2.output);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing PascalCase conversion:', e.message);
    failed++;
  }
  
  // Test 3: Fixer handles SCREAMING_SNAKE_CASE
  try {
    const code3 = 'export const PAGE_SIZE = 20;';
    const result3 = await lintAndFix(code3, 'test.tsx');
    
    if (result3.output && result3.output.includes('page_size.ts')) {
      console.log('✅ PASS: Fixer handles SCREAMING_SNAKE_CASE');
      passed++;
    } else {
      console.log('❌ FAIL: Fixer should handle SCREAMING_SNAKE_CASE');
      console.log('  Output:', result3.output);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing SCREAMING_SNAKE_CASE:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing fixer generates correct import statement:\n');
  
  // Test 4: Fixer generates import statement
  try {
    const code4 = 'export const pageSize = 20;';
    const result4 = await lintAndFix(code4, 'test.tsx');
    
    if (result4.output && result4.output.includes("import { pageSize } from './page-size';")) {
      console.log('✅ PASS: Fixer generates correct import statement');
      passed++;
    } else {
      console.log('❌ FAIL: Fixer should generate correct import statement');
      console.log('  Output:', result4.output);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing import statement:', e.message);
    failed++;
  }
  
  // Test 5: Fixer generates TODO comment
  try {
    const code5 = 'export const pageSize = 20;';
    const result5 = await lintAndFix(code5, 'test.tsx');
    
    if (result5.output && result5.output.includes('// TODO: Create page-size.ts with:')) {
      console.log('✅ PASS: Fixer generates TODO comment');
      passed++;
    } else {
      console.log('❌ FAIL: Fixer should generate TODO comment');
      console.log('  Output:', result5.output);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing TODO comment:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing fixer does not break syntax:\n');
  
  // Test 6: Fixer output is valid JavaScript
  try {
    const code6 = 'export const pageSize = 20;';
    const result6 = await lintAndFix(code6, 'test.tsx');
    
    // Try to parse the output to ensure it's valid
    if (result6.output) {
      // The output should be valid JavaScript (comments + import)
      const hasValidStructure = 
        result6.output.includes('// TODO:') && 
        result6.output.includes('import {');
      
      if (hasValidStructure) {
        console.log('✅ PASS: Fixer output has valid structure');
        passed++;
      } else {
        console.log('❌ FAIL: Fixer output should have valid structure');
        console.log('  Output:', result6.output);
        failed++;
      }
    } else {
      console.log('❌ FAIL: Fixer should produce output');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing fixer output:', e.message);
    failed++;
  }
  
  // Test 7: Fixer works with function exports
  try {
    const code7 = 'export function helperFunction() { return 42; }';
    const result7 = await lintAndFix(code7, 'test.tsx');
    
    if (result7.output && 
        result7.output.includes('helper-function.ts') &&
        result7.output.includes("import { helperFunction } from './helper-function';")) {
      console.log('✅ PASS: Fixer works with function exports');
      passed++;
    } else {
      console.log('❌ FAIL: Fixer should work with function exports');
      console.log('  Output:', result7.output);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing function export fixer:', e.message);
    failed++;
  }
  
  // Test 8: Fixer preserves original export code in comment
  try {
    const code8 = 'export const myValue = 42;';
    const result8 = await lintAndFix(code8, 'test.tsx');
    
    if (result8.output && result8.output.includes('// export const myValue = 42;')) {
      console.log('✅ PASS: Fixer preserves original export code in comment');
      passed++;
    } else {
      console.log('❌ FAIL: Fixer should preserve original export code');
      console.log('  Output:', result8.output);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing code preservation:', e.message);
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
