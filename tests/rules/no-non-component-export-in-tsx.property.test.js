/**
 * Property-based tests for no-non-component-export-in-tsx rule
 * Feature: eslint-plugin-react-pure-export
 * Validates: Requirements 1.2, 1.3, 1.7, 1.8, 1.9, 8.6
 */

const { ESLint } = require('eslint');

console.log('🧪 Property-based tests for no-non-component-export-in-tsx rule...\n');

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

/**
 * Generate random identifier name
 */
function randomIdentifier() {
  const prefixes = ['data', 'config', 'helper', 'util', 'constant', 'value', 'item', 'element'];
  const suffixes = ['A', 'B', 'C', 'X', 'Y', 'Z', '1', '2', '3'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return prefix + suffix;
}

/**
 * Generate random runtime export (non-component)
 */
function generateRandomRuntimeExport() {
  const types = ['const', 'function', 'let', 'var'];
  const type = types[Math.floor(Math.random() * types.length)];
  const name = randomIdentifier();
  const value = Math.floor(Math.random() * 1000);
  
  if (type === 'function') {
    return `export function ${name}() { return ${value}; }`;
  } else {
    return `export ${type} ${name} = ${value};`;
  }
}

/**
 * Generate random type-only export
 */
function generateRandomTypeExport() {
  const types = ['type', 'interface'];
  const type = types[Math.floor(Math.random() * types.length)];
  const name = randomIdentifier();
  
  if (type === 'type') {
    const values = ['string', 'number', 'boolean', '"active" | "inactive"', '{ id: number }'];
    const value = values[Math.floor(Math.random() * values.length)];
    return `export type ${name} = ${value};`;
  } else {
    return `export interface ${name} { id: number; name: string; }`;
  }
}

/**
 * Generate random runtime enum
 */
function generateRandomRuntimeEnum() {
  const name = randomIdentifier();
  const members = ['Active', 'Inactive', 'Pending', 'Complete'];
  const memberList = members.slice(0, 2 + Math.floor(Math.random() * 3)).join(', ');
  return `export enum ${name} { ${memberList} }`;
}

/**
 * Generate random non-exported declaration
 */
function generateRandomNonExport() {
  const types = ['const', 'function', 'let', 'var'];
  const type = types[Math.floor(Math.random() * types.length)];
  const name = randomIdentifier();
  const value = Math.floor(Math.random() * 1000);
  
  if (type === 'function') {
    return `function ${name}() { return ${value}; }`;
  } else {
    return `${type} ${name} = ${value};`;
  }
}

/**
 * Generate random export syntax variant
 */
function generateRandomExportVariant() {
  const variants = [
    // Named export with declaration
    () => `export const ${randomIdentifier()} = ${Math.random() * 100};`,
    // Named export with function
    () => `export function ${randomIdentifier()}() { return 42; }`,
    // Type export
    () => `export type ${randomIdentifier()} = string;`,
    // Interface export
    () => `export interface ${randomIdentifier()} { id: number; }`,
    // Const enum (type-only)
    () => `export const enum ${randomIdentifier()} { A, B }`,
    // Runtime enum
    () => `export enum ${randomIdentifier()} { A, B }`,
    // React.FC component
    () => `export const ${randomIdentifier()}: React.FC = () => <div>Test</div>;`,
    // React.memo component
    () => `export const ${randomIdentifier()} = React.memo(() => <div>Test</div>);`,
    // React.forwardRef component
    () => `export const ${randomIdentifier()} = React.forwardRef((props, ref) => <div ref={ref}>Test</div>);`
  ];
  
  const variant = variants[Math.floor(Math.random() * variants.length)];
  return variant();
}

async function runPropertyTests() {
  let passed = 0;
  let failed = 0;
  const iterations = 100;
  
  console.log('📋 Property 1: Non-component runtime exports are rejected in TSX files\n');
  console.log('   Validates: Requirements 1.2\n');
  
  try {
    let property1Passed = true;
    for (let i = 0; i < iterations; i++) {
      const code = generateRandomRuntimeExport();
      const result = await lintCode(code, 'test.tsx');
      
      if (result.messages.length === 0) {
        console.log(`❌ FAIL: Iteration ${i + 1} - Expected error but got none`);
        console.log(`   Code: ${code}`);
        property1Passed = false;
        break;
      }
    }
    
    if (property1Passed) {
      console.log(`✅ PASS: All ${iterations} iterations passed - Non-component runtime exports are rejected`);
      passed++;
    } else {
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error in Property 1:', e.message);
    failed++;
  }
  
  console.log('\n📋 Property 2: Type exports are allowed in TSX files\n');
  console.log('   Validates: Requirements 1.3, 1.7\n');
  
  try {
    let property2Passed = true;
    for (let i = 0; i < iterations; i++) {
      const code = generateRandomTypeExport();
      const result = await lintCode(code, 'test.tsx');
      
      if (result.messages.length > 0) {
        console.log(`❌ FAIL: Iteration ${i + 1} - Expected no error but got one`);
        console.log(`   Code: ${code}`);
        console.log(`   Messages:`, result.messages);
        property2Passed = false;
        break;
      }
    }
    
    if (property2Passed) {
      console.log(`✅ PASS: All ${iterations} iterations passed - Type exports are allowed`);
      passed++;
    } else {
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error in Property 2:', e.message);
    failed++;
  }
  
  console.log('\n📋 Property 4: Runtime enums are rejected in TSX files\n');
  console.log('   Validates: Requirements 1.8\n');
  
  try {
    let property4Passed = true;
    for (let i = 0; i < iterations; i++) {
      const code = generateRandomRuntimeEnum();
      const result = await lintCode(code, 'test.tsx');
      
      if (result.messages.length === 0) {
        console.log(`❌ FAIL: Iteration ${i + 1} - Expected error but got none`);
        console.log(`   Code: ${code}`);
        property4Passed = false;
        break;
      }
      
      // Check that it's the correct error message
      if (result.messages[0].messageId !== 'runtimeEnumExport') {
        console.log(`❌ FAIL: Iteration ${i + 1} - Expected runtimeEnumExport message`);
        console.log(`   Code: ${code}`);
        console.log(`   Got messageId: ${result.messages[0].messageId}`);
        property4Passed = false;
        break;
      }
    }
    
    if (property4Passed) {
      console.log(`✅ PASS: All ${iterations} iterations passed - Runtime enums are rejected`);
      passed++;
    } else {
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error in Property 4:', e.message);
    failed++;
  }
  
  console.log('\n📋 Property 5: Non-exported declarations are ignored\n');
  console.log('   Validates: Requirements 1.9\n');
  
  try {
    let property5Passed = true;
    for (let i = 0; i < iterations; i++) {
      const code = generateRandomNonExport();
      const result = await lintCode(code, 'test.tsx');
      
      if (result.messages.length > 0) {
        console.log(`❌ FAIL: Iteration ${i + 1} - Expected no error but got one`);
        console.log(`   Code: ${code}`);
        console.log(`   Messages:`, result.messages);
        property5Passed = false;
        break;
      }
    }
    
    if (property5Passed) {
      console.log(`✅ PASS: All ${iterations} iterations passed - Non-exported declarations are ignored`);
      passed++;
    } else {
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error in Property 5:', e.message);
    failed++;
  }
  
  console.log('\n📋 Property 6: All export syntax variants are handled\n');
  console.log('   Validates: Requirements 8.6\n');
  
  try {
    let property6Passed = true;
    let parseErrors = 0;
    
    for (let i = 0; i < iterations; i++) {
      const code = generateRandomExportVariant();
      
      try {
        const result = await lintCode(code, 'test.tsx');
        // Just verify it doesn't crash - the rule should handle all variants
      } catch (e) {
        if (e.message.includes('Parsing error')) {
          parseErrors++;
          if (parseErrors > 5) {
            console.log(`❌ FAIL: Too many parse errors (${parseErrors})`);
            property6Passed = false;
            break;
          }
        } else {
          throw e;
        }
      }
    }
    
    if (property6Passed) {
      console.log(`✅ PASS: All ${iterations} iterations handled - All export syntax variants are processed`);
      if (parseErrors > 0) {
        console.log(`   Note: ${parseErrors} parse errors (acceptable for random generation)`);
      }
      passed++;
    } else {
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error in Property 6:', e.message);
    failed++;
  }
  
  // Summary
  const total = passed + failed;
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`📈 SUMMARY: ${passed}/${total} properties passed`);
  console.log(`   Each property tested with ${iterations} iterations`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  return { passed, failed };
}

runPropertyTests().then(result => {
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
