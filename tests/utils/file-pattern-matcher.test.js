/**
 * Tests for file-pattern-matcher utility
 * Feature: eslint-plugin-react-pure-export, Property 7: Pure module patterns are recognized
 * Validates: Requirements 2.1, 2.2, 2.3
 */

const { matchesPattern, isPureModule, isTsxFile } = require('../../lib/utils/file-pattern-matcher');

/**
 * Generate a random string for testing
 */
function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random filename with a specific extension
 */
function generateFilename(extension) {
  const name = randomString(5 + Math.floor(Math.random() * 10));
  return `${name}.${extension}`;
}

/**
 * Generate a random pure module filename
 */
function generatePureModuleFilename() {
  const patterns = ['pure.ts', 'utils.ts', 'config.ts'];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const name = randomString(5 + Math.floor(Math.random() * 10));
  return `${name}.${pattern}`;
}

/**
 * Generate a random non-pure module filename
 */
function generateNonPureModuleFilename() {
  const extensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'css'];
  const ext = extensions[Math.floor(Math.random() * extensions.length)];
  const name = randomString(5 + Math.floor(Math.random() * 10));
  return `${name}.${ext}`;
}

console.log('🧪 Testing file-pattern-matcher utility...\n');

// Unit tests for basic functionality
console.log('📋 Unit Tests:\n');

let unitTestsPassed = 0;
let unitTestsFailed = 0;

// Test 1: matchesPattern with simple patterns
const test1 = matchesPattern('test.ts', '*.ts');
if (test1 === true) {
  console.log('✅ PASS: matchesPattern recognizes *.ts pattern');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: matchesPattern should recognize *.ts pattern');
  unitTestsFailed++;
}

// Test 2: matchesPattern with complex patterns
const test2 = matchesPattern('helpers.pure.ts', '*.pure.ts');
if (test2 === true) {
  console.log('✅ PASS: matchesPattern recognizes *.pure.ts pattern');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: matchesPattern should recognize *.pure.ts pattern');
  unitTestsFailed++;
}

// Test 3: matchesPattern with paths
const test3 = matchesPattern('src/utils/helpers.pure.ts', '*.pure.ts');
if (test3 === true) {
  console.log('✅ PASS: matchesPattern handles file paths correctly');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: matchesPattern should handle file paths');
  unitTestsFailed++;
}

// Test 4: matchesPattern with empty string
const test4 = matchesPattern('', '*.ts');
if (test4 === false) {
  console.log('✅ PASS: matchesPattern rejects empty filename');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: matchesPattern should reject empty filename');
  unitTestsFailed++;
}

// Test 5: matchesPattern with null/undefined
const test5 = matchesPattern(null, '*.ts');
if (test5 === false) {
  console.log('✅ PASS: matchesPattern handles null filename');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: matchesPattern should handle null filename');
  unitTestsFailed++;
}

// Test 6: isPureModule with .pure.ts
const test6 = isPureModule('helpers.pure.ts');
if (test6 === true) {
  console.log('✅ PASS: isPureModule recognizes .pure.ts files');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: isPureModule should recognize .pure.ts files');
  unitTestsFailed++;
}

// Test 7: isPureModule with .utils.ts
const test7 = isPureModule('helpers.utils.ts');
if (test7 === true) {
  console.log('✅ PASS: isPureModule recognizes .utils.ts files');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: isPureModule should recognize .utils.ts files');
  unitTestsFailed++;
}

// Test 8: isPureModule with .config.ts
const test8 = isPureModule('constants.config.ts');
if (test8 === true) {
  console.log('✅ PASS: isPureModule recognizes .config.ts files');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: isPureModule should recognize .config.ts files');
  unitTestsFailed++;
}

// Test 9: isPureModule with regular .ts file
const test9 = isPureModule('regular.ts');
if (test9 === false) {
  console.log('✅ PASS: isPureModule rejects regular .ts files');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: isPureModule should reject regular .ts files');
  unitTestsFailed++;
}

// Test 10: isTsxFile with .tsx extension
const test10 = isTsxFile('Component.tsx');
if (test10 === true) {
  console.log('✅ PASS: isTsxFile recognizes .tsx files');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: isTsxFile should recognize .tsx files');
  unitTestsFailed++;
}

// Test 11: isTsxFile with .ts extension
const test11 = isTsxFile('module.ts');
if (test11 === false) {
  console.log('✅ PASS: isTsxFile rejects .ts files');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: isTsxFile should reject .ts files');
  unitTestsFailed++;
}

// Test 12: matchesPattern with special characters in filename
const test12 = matchesPattern('test-file_v2.ts', '*.ts');
if (test12 === true) {
  console.log('✅ PASS: matchesPattern handles special characters');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: matchesPattern should handle special characters');
  unitTestsFailed++;
}

// Test 13: matchesPattern with Windows path separators
const test13 = matchesPattern('src\\utils\\helpers.pure.ts', '*.pure.ts');
if (test13 === true) {
  console.log('✅ PASS: matchesPattern handles Windows path separators');
  unitTestsPassed++;
} else {
  console.log('❌ FAIL: matchesPattern should handle Windows path separators');
  unitTestsFailed++;
}

console.log(`\n📊 Unit Tests: ${unitTestsPassed} passed, ${unitTestsFailed} failed\n`);

// Property-based tests
console.log('🔬 Property-Based Tests (100 iterations each):\n');

let propertyTestsPassed = 0;
let propertyTestsFailed = 0;

// Property Test 1: All generated pure module filenames should be recognized
console.log('Testing Property 7a: Pure module patterns are recognized...');
let property7aFailed = false;
for (let i = 0; i < 100; i++) {
  const filename = generatePureModuleFilename();
  if (!isPureModule(filename)) {
    console.log(`❌ FAIL: Iteration ${i + 1} - isPureModule should recognize "${filename}"`);
    property7aFailed = true;
    break;
  }
}
if (!property7aFailed) {
  console.log('✅ PASS: Property 7a - All 100 pure module filenames recognized');
  propertyTestsPassed++;
} else {
  propertyTestsFailed++;
}

// Property Test 2: Non-pure module filenames should be rejected
console.log('Testing Property 7b: Non-pure module patterns are rejected...');
let property7bFailed = false;
for (let i = 0; i < 100; i++) {
  const filename = generateNonPureModuleFilename();
  // Only check if it's not accidentally a pure module pattern
  if (!filename.endsWith('.pure.ts') && !filename.endsWith('.utils.ts') && !filename.endsWith('.config.ts')) {
    if (isPureModule(filename)) {
      console.log(`❌ FAIL: Iteration ${i + 1} - isPureModule should reject "${filename}"`);
      property7bFailed = true;
      break;
    }
  }
}
if (!property7bFailed) {
  console.log('✅ PASS: Property 7b - All 100 non-pure module filenames rejected');
  propertyTestsPassed++;
} else {
  propertyTestsFailed++;
}

// Property Test 3: All .tsx files should be recognized
console.log('Testing Property 7c: TSX files are recognized...');
let property7cFailed = false;
for (let i = 0; i < 100; i++) {
  const filename = generateFilename('tsx');
  if (!isTsxFile(filename)) {
    console.log(`❌ FAIL: Iteration ${i + 1} - isTsxFile should recognize "${filename}"`);
    property7cFailed = true;
    break;
  }
}
if (!property7cFailed) {
  console.log('✅ PASS: Property 7c - All 100 .tsx filenames recognized');
  propertyTestsPassed++;
} else {
  propertyTestsFailed++;
}

// Property Test 4: Pattern matching works with paths
console.log('Testing Property 7d: Pattern matching handles file paths...');
let property7dFailed = false;
for (let i = 0; i < 100; i++) {
  const depth = 1 + Math.floor(Math.random() * 5);
  const pathParts = [];
  for (let j = 0; j < depth; j++) {
    pathParts.push(randomString(5));
  }
  const filename = generatePureModuleFilename();
  const fullPath = pathParts.join('/') + '/' + filename;
  
  if (!isPureModule(fullPath)) {
    console.log(`❌ FAIL: Iteration ${i + 1} - isPureModule should recognize "${fullPath}"`);
    property7dFailed = true;
    break;
  }
}
if (!property7dFailed) {
  console.log('✅ PASS: Property 7d - All 100 paths with pure modules recognized');
  propertyTestsPassed++;
} else {
  propertyTestsFailed++;
}

console.log(`\n📊 Property Tests: ${propertyTestsPassed} passed, ${propertyTestsFailed} failed\n`);

// Summary
const totalPassed = unitTestsPassed + propertyTestsPassed;
const totalFailed = unitTestsFailed + propertyTestsFailed;
const totalTests = totalPassed + totalFailed;

console.log('═══════════════════════════════════════════════════════');
console.log(`📈 SUMMARY: ${totalPassed}/${totalTests} tests passed`);
console.log('═══════════════════════════════════════════════════════\n');

// Exit with appropriate code
process.exit(totalFailed > 0 ? 1 : 0);
