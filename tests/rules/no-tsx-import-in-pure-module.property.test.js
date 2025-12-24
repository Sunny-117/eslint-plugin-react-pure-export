/**
 * Property-based tests for no-tsx-import-in-pure-module rule
 * Feature: eslint-plugin-react-pure-export
 * 
 * Property 8: TSX imports are rejected in pure modules
 * Validates: Requirements 2.4
 * 
 * Property 9: Non-TSX imports are allowed in pure modules
 * Validates: Requirements 2.5
 */

const { ESLint } = require('eslint');

console.log('🧪 Property-based tests for no-tsx-import-in-pure-module rule...\n');

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

/**
 * Generate a random identifier
 */
function generateRandomIdentifier() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = Math.floor(Math.random() * 10) + 5;
  let result = chars[Math.floor(Math.random() * 52)]; // Start with letter
  for (let i = 1; i < length; i++) {
    result += chars[Math.floor(Math.random() * 52)];
  }
  return result;
}

/**
 * Generate a random .tsx file path
 */
function generateRandomTsxPath() {
  const depth = Math.floor(Math.random() * 3);
  let path = '';
  
  // Add random directory depth
  for (let i = 0; i < depth; i++) {
    if (Math.random() > 0.5) {
      path += '../';
    } else {
      path += './';
    }
    path += generateRandomIdentifier() + '/';
  }
  
  // Add filename
  if (path === '') {
    path = './';
  }
  path += generateRandomIdentifier() + '.tsx';
  
  return path;
}

/**
 * Generate a random non-.tsx file path
 */
function generateRandomNonTsxPath() {
  const extensions = ['.ts', '.js', '.json', '.css', '.scss', ''];
  const ext = extensions[Math.floor(Math.random() * extensions.length)];
  
  const depth = Math.floor(Math.random() * 3);
  let path = '';
  
  // Add random directory depth
  for (let i = 0; i < depth; i++) {
    if (Math.random() > 0.5) {
      path += '../';
    } else {
      path += './';
    }
    path += generateRandomIdentifier() + '/';
  }
  
  // Add filename
  if (path === '') {
    path = './';
  }
  path += generateRandomIdentifier() + ext;
  
  return path;
}

/**
 * Generate a random npm package name
 */
function generateRandomNpmPackage() {
  const packages = [
    'react',
    'react-dom',
    'lodash',
    'axios',
    'express',
    '@types/node',
    '@typescript-eslint/parser',
    'vitest'
  ];
  
  if (Math.random() > 0.5) {
    return packages[Math.floor(Math.random() * packages.length)];
  } else {
    return generateRandomIdentifier();
  }
}

/**
 * Generate a random pure module filename
 */
function generateRandomPureModuleFilename() {
  const patterns = ['.pure.ts', '.utils.ts', '.config.ts'];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const name = generateRandomIdentifier();
  return name + pattern;
}

/**
 * Generate a random import statement
 */
function generateRandomImport(source) {
  const importTypes = [
    `import { ${generateRandomIdentifier()} } from "${source}";`,
    `import ${generateRandomIdentifier()} from "${source}";`,
    `import * as ${generateRandomIdentifier()} from "${source}";`,
    `import { ${generateRandomIdentifier()}, ${generateRandomIdentifier()} } from "${source}";`
  ];
  
  return importTypes[Math.floor(Math.random() * importTypes.length)];
}

/**
 * Property 8: TSX imports are rejected in pure modules
 * For any pure module file that imports a .tsx file, the rule should report an error
 */
async function testProperty8() {
  console.log('🔬 Property 8: TSX imports are rejected in pure modules');
  console.log('   Validates: Requirements 2.4\n');
  
  const iterations = 100;
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < iterations; i++) {
    try {
      // Generate random pure module filename
      const filename = generateRandomPureModuleFilename();
      
      // Generate random .tsx import
      const tsxPath = generateRandomTsxPath();
      const code = generateRandomImport(tsxPath);
      
      // Lint the code
      const result = await lintCode(code, filename);
      
      // Should have error
      if (result.messages.length > 0 && 
          result.messages[0].messageId === 'tsxImportInPureModule') {
        passed++;
      } else {
        failed++;
        if (failed <= 3) { // Only log first 3 failures
          console.log(`  ❌ Iteration ${i + 1} failed:`);
          console.log(`     File: ${filename}`);
          console.log(`     Code: ${code}`);
          console.log(`     Expected error but got: ${result.messages.length} messages`);
        }
      }
    } catch (e) {
      failed++;
      if (failed <= 3) {
        console.log(`  ❌ Iteration ${i + 1} error: ${e.message}`);
      }
    }
  }
  
  console.log(`\n  📊 Results: ${passed}/${iterations} passed`);
  
  if (passed === iterations) {
    console.log('  ✅ Property 8 PASSED\n');
    return true;
  } else {
    console.log(`  ❌ Property 8 FAILED (${failed} failures)\n`);
    return false;
  }
}

/**
 * Property 9: Non-TSX imports are allowed in pure modules
 * For any pure module file that imports non-.tsx files, the rule should not report errors
 */
async function testProperty9() {
  console.log('🔬 Property 9: Non-TSX imports are allowed in pure modules');
  console.log('   Validates: Requirements 2.5\n');
  
  const iterations = 100;
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < iterations; i++) {
    try {
      // Generate random pure module filename
      const filename = generateRandomPureModuleFilename();
      
      // Generate random non-.tsx import (50% file path, 50% npm package)
      let importPath;
      if (Math.random() > 0.5) {
        importPath = generateRandomNonTsxPath();
      } else {
        importPath = generateRandomNpmPackage();
      }
      
      const code = generateRandomImport(importPath);
      
      // Lint the code
      const result = await lintCode(code, filename);
      
      // Should not have error
      if (result.messages.length === 0) {
        passed++;
      } else {
        failed++;
        if (failed <= 3) { // Only log first 3 failures
          console.log(`  ❌ Iteration ${i + 1} failed:`);
          console.log(`     File: ${filename}`);
          console.log(`     Code: ${code}`);
          console.log(`     Expected no error but got: ${result.messages[0].message}`);
        }
      }
    } catch (e) {
      failed++;
      if (failed <= 3) {
        console.log(`  ❌ Iteration ${i + 1} error: ${e.message}`);
      }
    }
  }
  
  console.log(`\n  📊 Results: ${passed}/${iterations} passed`);
  
  if (passed === iterations) {
    console.log('  ✅ Property 9 PASSED\n');
    return true;
  } else {
    console.log(`  ❌ Property 9 FAILED (${failed} failures)\n`);
    return false;
  }
}

/**
 * Run all property tests
 */
async function runPropertyTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('Running Property-Based Tests (100 iterations each)');
  console.log('═══════════════════════════════════════════════════════\n');
  
  const results = [];
  
  // Run Property 8
  results.push(await testProperty8());
  
  // Run Property 9
  results.push(await testProperty9());
  
  // Summary
  const allPassed = results.every(r => r === true);
  const passedCount = results.filter(r => r === true).length;
  
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📈 SUMMARY: ${passedCount}/${results.length} properties passed`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  return allPassed;
}

runPropertyTests().then(allPassed => {
  if (allPassed) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Property test execution failed:', err);
  process.exit(1);
});
