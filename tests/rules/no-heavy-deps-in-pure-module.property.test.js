/**
 * Property-based tests for no-heavy-deps-in-pure-module rule
 * Feature: eslint-plugin-react-pure-export
 * 
 * Property 10: Forbidden dependencies are rejected in pure modules
 * Validates: Requirements 3.2
 * 
 * Property 11: Configuration options are respected
 * Validates: Requirements 3.1
 */

const { ESLint } = require('eslint');

console.log('🧪 Property-based tests for no-heavy-deps-in-pure-module rule...\n');

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
    `import "${source}";`
  ];
  
  return importTypes[Math.floor(Math.random() * importTypes.length)];
}

/**
 * Generate a random forbidden dependency from defaults
 */
function generateRandomForbiddenDep() {
  const defaultForbidden = ['react', 'react-dom'];
  return defaultForbidden[Math.floor(Math.random() * defaultForbidden.length)];
}

/**
 * Generate a random file path with forbidden extension
 */
function generateRandomForbiddenExtensionPath() {
  const defaultExtensions = ['.css', '.less', '.scss'];
  const ext = defaultExtensions[Math.floor(Math.random() * defaultExtensions.length)];
  
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
 * Generate a random allowed dependency
 */
function generateRandomAllowedDep() {
  const allowed = [
    'lodash',
    'axios',
    'date-fns',
    'express',
    '@types/node',
    'vitest',
    generateRandomIdentifier()
  ];
  return allowed[Math.floor(Math.random() * allowed.length)];
}

/**
 * Generate a random allowed file path
 */
function generateRandomAllowedPath() {
  const extensions = ['.ts', '.js', '.json', ''];
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
 * Generate random configuration
 */
function generateRandomConfig() {
  const configs = [
    // Custom forbidden deps
    {
      forbiddenDeps: [generateRandomIdentifier(), generateRandomIdentifier()],
      forbiddenExtensions: ['.css', '.less', '.scss']
    },
    // Custom forbidden extensions
    {
      forbiddenDeps: ['react', 'react-dom'],
      forbiddenExtensions: ['.png', '.jpg', '.svg']
    },
    // Both custom
    {
      forbiddenDeps: [generateRandomIdentifier()],
      forbiddenExtensions: ['.xml', '.yaml']
    },
    // Empty arrays (should use defaults)
    {},
    // Only forbiddenDeps
    {
      forbiddenDeps: [generateRandomIdentifier(), generateRandomIdentifier()]
    },
    // Only forbiddenExtensions
    {
      forbiddenExtensions: ['.sass', '.styl']
    }
  ];
  
  return configs[Math.floor(Math.random() * configs.length)];
}

/**
 * Property 10: Forbidden dependencies are rejected in pure modules
 * For any pure module file that imports a forbidden dependency, the rule should report an error
 */
async function testProperty10() {
  console.log('🔬 Property 10: Forbidden dependencies are rejected in pure modules');
  console.log('   Validates: Requirements 3.2\n');
  
  const iterations = 100;
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < iterations; i++) {
    try {
      // Generate random pure module filename
      const filename = generateRandomPureModuleFilename();
      
      // Generate random forbidden import (50% dep, 50% extension)
      let importSource;
      if (Math.random() > 0.5) {
        importSource = generateRandomForbiddenDep();
      } else {
        importSource = generateRandomForbiddenExtensionPath();
      }
      
      const code = generateRandomImport(importSource);
      
      // Lint the code with default config
      const result = await lintCode(code, filename);
      
      // Should have error
      if (result.messages.length > 0 && 
          result.messages[0].messageId === 'heavyDepInPureModule') {
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
    console.log('  ✅ Property 10 PASSED\n');
    return true;
  } else {
    console.log(`  ❌ Property 10 FAILED (${failed} failures)\n`);
    return false;
  }
}

/**
 * Property 11: Configuration options are respected
 * For any configuration provided, the rule should use those values when evaluating imports
 */
async function testProperty11() {
  console.log('🔬 Property 11: Configuration options are respected');
  console.log('   Validates: Requirements 3.1\n');
  
  const iterations = 100;
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < iterations; i++) {
    try {
      // Generate random pure module filename
      const filename = generateRandomPureModuleFilename();
      
      // Generate random configuration
      const config = generateRandomConfig();
      
      // Determine what should be forbidden based on config
      const forbiddenDeps = config.forbiddenDeps || ['react', 'react-dom'];
      const forbiddenExtensions = config.forbiddenExtensions || ['.css', '.less', '.scss'];
      
      // Test 1: Import a forbidden dep from config - should error
      if (forbiddenDeps.length > 0) {
        const forbiddenDep = forbiddenDeps[Math.floor(Math.random() * forbiddenDeps.length)];
        const code1 = generateRandomImport(forbiddenDep);
        const result1 = await lintCode(code1, filename, config);
        
        if (result1.messages.length === 0 || 
            result1.messages[0].messageId !== 'heavyDepInPureModule') {
          failed++;
          if (failed <= 3) {
            console.log(`  ❌ Iteration ${i + 1} failed (forbidden dep):`);
            console.log(`     Config: ${JSON.stringify(config)}`);
            console.log(`     Code: ${code1}`);
            console.log(`     Expected error for forbidden dep`);
          }
          continue;
        }
      }
      
      // Test 2: Import a forbidden extension from config - should error
      if (forbiddenExtensions.length > 0) {
        const ext = forbiddenExtensions[Math.floor(Math.random() * forbiddenExtensions.length)];
        const forbiddenPath = './' + generateRandomIdentifier() + ext;
        const code2 = generateRandomImport(forbiddenPath);
        const result2 = await lintCode(code2, filename, config);
        
        if (result2.messages.length === 0 || 
            result2.messages[0].messageId !== 'heavyDepInPureModule') {
          failed++;
          if (failed <= 3) {
            console.log(`  ❌ Iteration ${i + 1} failed (forbidden ext):`);
            console.log(`     Config: ${JSON.stringify(config)}`);
            console.log(`     Code: ${code2}`);
            console.log(`     Expected error for forbidden extension`);
          }
          continue;
        }
      }
      
      // Test 3: Import an allowed dep - should not error
      const allowedDep = generateRandomAllowedDep();
      // Make sure it's not in forbidden list
      if (!forbiddenDeps.includes(allowedDep)) {
        const code3 = generateRandomImport(allowedDep);
        const result3 = await lintCode(code3, filename, config);
        
        if (result3.messages.length > 0) {
          failed++;
          if (failed <= 3) {
            console.log(`  ❌ Iteration ${i + 1} failed (allowed dep):`);
            console.log(`     Config: ${JSON.stringify(config)}`);
            console.log(`     Code: ${code3}`);
            console.log(`     Expected no error for allowed dep`);
          }
          continue;
        }
      }
      
      passed++;
    } catch (e) {
      failed++;
      if (failed <= 3) {
        console.log(`  ❌ Iteration ${i + 1} error: ${e.message}`);
      }
    }
  }
  
  console.log(`\n  📊 Results: ${passed}/${iterations} passed`);
  
  if (passed === iterations) {
    console.log('  ✅ Property 11 PASSED\n');
    return true;
  } else {
    console.log(`  ❌ Property 11 FAILED (${failed} failures)\n`);
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
  
  // Run Property 10
  results.push(await testProperty10());
  
  // Run Property 11
  results.push(await testProperty11());
  
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
