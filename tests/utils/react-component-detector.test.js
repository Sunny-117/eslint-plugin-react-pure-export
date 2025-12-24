/**
 * Tests for react-component-detector utility
 * Feature: eslint-plugin-react-pure-export, Property 3: React components are correctly identified
 * Validates: Requirements 1.4, 1.5, 1.6
 */

const { isReactComponent, isReactFC, isReactMemo, isReactForwardRef } = require('../../lib/utils/react-component-detector');

console.log('🧪 Testing react-component-detector utility...\n');

/**
 * Helper function to parse code and get AST nodes
 */
function parseCode(code) {
  const parser = require('@typescript-eslint/parser');
  const ast = parser.parse(code, {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  });
  
  return ast;
}

/**
 * Find nodes of a specific type in AST
 */
function findNodes(ast, nodeType) {
  const nodes = [];
  
  function traverse(node) {
    if (!node || typeof node !== 'object') {
      return;
    }
    
    if (node.type === nodeType) {
      nodes.push(node);
    }
    
    for (const key in node) {
      if (key === 'parent') continue;
      const value = node[key];
      if (Array.isArray(value)) {
        value.forEach(traverse);
      } else if (typeof value === 'object' && value !== null) {
        traverse(value);
      }
    }
  }
  
  traverse(ast);
  return nodes;
}

/**
 * Generate a random component name
 */
function randomComponentName() {
  const names = ['Button', 'Input', 'Card', 'Modal', 'Header', 'Footer', 'Sidebar', 'Menu', 'List', 'Item'];
  return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000);
}

/**
 * Generate a random React.FC component
 */
function generateReactFCComponent() {
  const name = randomComponentName();
  const variants = [
    `export const ${name}: React.FC = () => <div>${name}</div>;`,
    `export const ${name}: FC = () => <div>${name}</div>;`,
    `export const ${name}: React.FunctionComponent = () => <div>${name}</div>;`,
    `export const ${name}: FunctionComponent = () => <div>${name}</div>;`
  ];
  return variants[Math.floor(Math.random() * variants.length)];
}

/**
 * Generate a random React.memo component
 */
function generateReactMemoComponent() {
  const name = randomComponentName();
  const variants = [
    `export const ${name} = React.memo(() => <div>${name}</div>);`,
    `export const ${name} = memo(() => <div>${name}</div>);`,
    `export const ${name} = React.memo(function ${name}() { return <div>${name}</div>; });`,
    `export const ${name} = memo(function ${name}() { return <div>${name}</div>; });`
  ];
  return variants[Math.floor(Math.random() * variants.length)];
}

/**
 * Generate a random React.forwardRef component
 */
function generateReactForwardRefComponent() {
  const name = randomComponentName();
  const variants = [
    `export const ${name} = React.forwardRef(() => <div>${name}</div>);`,
    `export const ${name} = forwardRef(() => <div>${name}</div>);`,
    `export const ${name} = React.forwardRef((props, ref) => <div ref={ref}>${name}</div>);`,
    `export const ${name} = forwardRef((props, ref) => <div ref={ref}>${name}</div>);`
  ];
  return variants[Math.floor(Math.random() * variants.length)];
}

let passed = 0;
let failed = 0;

console.log('📋 Unit Tests:\n');

// Test 1: React.FC component
try {
  const ast1 = parseCode('export const Home: React.FC = () => <div>Home</div>;');
  const declarations1 = findNodes(ast1, 'VariableDeclaration');
  if (declarations1.length > 0 && isReactFC(declarations1[0])) {
    console.log('✅ PASS: isReactFC recognizes React.FC component');
    passed++;
  } else {
    console.log('❌ FAIL: isReactFC should recognize React.FC component');
    failed++;
  }
} catch (e) {
  console.log('❌ FAIL: Error testing React.FC:', e.message);
  failed++;
}

// Test 2: FC component (without React prefix)
try {
  const ast2 = parseCode('export const Home: FC = () => <div>Home</div>;');
  const declarations2 = findNodes(ast2, 'VariableDeclaration');
  if (declarations2.length > 0 && isReactFC(declarations2[0])) {
    console.log('✅ PASS: isReactFC recognizes FC component');
    passed++;
  } else {
    console.log('❌ FAIL: isReactFC should recognize FC component');
    failed++;
  }
} catch (e) {
  console.log('❌ FAIL: Error testing FC:', e.message);
  failed++;
}

// Test 3: React.memo component
try {
  const ast3 = parseCode('export const Home = React.memo(() => <div>Home</div>);');
  const declarations3 = findNodes(ast3, 'VariableDeclaration');
  if (declarations3.length > 0 && isReactMemo(declarations3[0])) {
    console.log('✅ PASS: isReactMemo recognizes React.memo component');
    passed++;
  } else {
    console.log('❌ FAIL: isReactMemo should recognize React.memo component');
    failed++;
  }
} catch (e) {
  console.log('❌ FAIL: Error testing React.memo:', e.message);
  failed++;
}

// Test 4: memo component (without React prefix)
try {
  const ast4 = parseCode('export const Home = memo(() => <div>Home</div>);');
  const declarations4 = findNodes(ast4, 'VariableDeclaration');
  if (declarations4.length > 0 && isReactMemo(declarations4[0])) {
    console.log('✅ PASS: isReactMemo recognizes memo component');
    passed++;
  } else {
    console.log('❌ FAIL: isReactMemo should recognize memo component');
    failed++;
  }
} catch (e) {
  console.log('❌ FAIL: Error testing memo:', e.message);
  failed++;
}

// Test 5: React.forwardRef component
try {
  const ast5 = parseCode('export const Home = React.forwardRef(() => <div>Home</div>);');
  const declarations5 = findNodes(ast5, 'VariableDeclaration');
  if (declarations5.length > 0 && isReactForwardRef(declarations5[0])) {
    console.log('✅ PASS: isReactForwardRef recognizes React.forwardRef component');
    passed++;
  } else {
    console.log('❌ FAIL: isReactForwardRef should recognize React.forwardRef component');
    failed++;
  }
} catch (e) {
  console.log('❌ FAIL: Error testing React.forwardRef:', e.message);
  failed++;
}

// Test 6: forwardRef component (without React prefix)
try {
  const ast6 = parseCode('export const Home = forwardRef(() => <div>Home</div>);');
  const declarations6 = findNodes(ast6, 'VariableDeclaration');
  if (declarations6.length > 0 && isReactForwardRef(declarations6[0])) {
    console.log('✅ PASS: isReactForwardRef recognizes forwardRef component');
    passed++;
  } else {
    console.log('❌ FAIL: isReactForwardRef should recognize forwardRef component');
    failed++;
  }
} catch (e) {
  console.log('❌ FAIL: Error testing forwardRef:', e.message);
  failed++;
}

// Test 7: isReactComponent recognizes all component types
try {
  const ast7a = parseCode('export const Home: React.FC = () => <div>Home</div>;');
  const declarations7a = findNodes(ast7a, 'VariableDeclaration');
  
  const ast7b = parseCode('export const Home = React.memo(() => <div>Home</div>);');
  const declarations7b = findNodes(ast7b, 'VariableDeclaration');
  
  const ast7c = parseCode('export const Home = React.forwardRef(() => <div>Home</div>);');
  const declarations7c = findNodes(ast7c, 'VariableDeclaration');
  
  if (declarations7a.length > 0 && isReactComponent(declarations7a[0]) &&
      declarations7b.length > 0 && isReactComponent(declarations7b[0]) &&
      declarations7c.length > 0 && isReactComponent(declarations7c[0])) {
    console.log('✅ PASS: isReactComponent recognizes all component types');
    passed++;
  } else {
    console.log('❌ FAIL: isReactComponent should recognize all component types');
    failed++;
  }
} catch (e) {
  console.log('❌ FAIL: Error testing isReactComponent:', e.message);
  failed++;
}

// Test 8: Non-component const should not be recognized
try {
  const ast8 = parseCode('export const PAGE_SIZE = 20;');
  const declarations8 = findNodes(ast8, 'VariableDeclaration');
  if (declarations8.length > 0 && !isReactComponent(declarations8[0])) {
    console.log('✅ PASS: isReactComponent rejects non-component const');
    passed++;
  } else {
    console.log('❌ FAIL: isReactComponent should reject non-component const');
    failed++;
  }
} catch (e) {
  console.log('❌ FAIL: Error testing non-component const:', e.message);
  failed++;
}

// Test 9: Function declaration should not be recognized
try {
  const ast9 = parseCode('export function helper() { return 42; }');
  const declarations9 = findNodes(ast9, 'FunctionDeclaration');
  if (declarations9.length > 0 && !isReactComponent(declarations9[0])) {
    console.log('✅ PASS: isReactComponent rejects function declaration');
    passed++;
  } else {
    console.log('❌ FAIL: isReactComponent should reject function declaration');
    failed++;
  }
} catch (e) {
  console.log('❌ FAIL: Error testing function declaration:', e.message);
  failed++;
}

console.log(`\n📊 Unit Tests: ${passed} passed, ${failed} failed\n`);

// Property-based tests
console.log('🔬 Property-Based Tests (100 iterations each):\n');

let propertyTestsPassed = 0;
let propertyTestsFailed = 0;

// Property Test 1: All React.FC components should be recognized
console.log('Testing Property 3a: React.FC components are recognized...');
let property3aFailed = false;
for (let i = 0; i < 100; i++) {
  try {
    const code = generateReactFCComponent();
    const ast = parseCode(code);
    const declarations = findNodes(ast, 'VariableDeclaration');
    
    if (declarations.length === 0 || !isReactFC(declarations[0])) {
      console.log(`❌ FAIL: Iteration ${i + 1} - isReactFC should recognize: ${code}`);
      property3aFailed = true;
      break;
    }
  } catch (e) {
    console.log(`❌ FAIL: Iteration ${i + 1} - Error: ${e.message}`);
    property3aFailed = true;
    break;
  }
}
if (!property3aFailed) {
  console.log('✅ PASS: Property 3a - All 100 React.FC components recognized');
  propertyTestsPassed++;
} else {
  propertyTestsFailed++;
}

// Property Test 2: All React.memo components should be recognized
console.log('Testing Property 3b: React.memo components are recognized...');
let property3bFailed = false;
for (let i = 0; i < 100; i++) {
  try {
    const code = generateReactMemoComponent();
    const ast = parseCode(code);
    const declarations = findNodes(ast, 'VariableDeclaration');
    
    if (declarations.length === 0 || !isReactMemo(declarations[0])) {
      console.log(`❌ FAIL: Iteration ${i + 1} - isReactMemo should recognize: ${code}`);
      property3bFailed = true;
      break;
    }
  } catch (e) {
    console.log(`❌ FAIL: Iteration ${i + 1} - Error: ${e.message}`);
    property3bFailed = true;
    break;
  }
}
if (!property3bFailed) {
  console.log('✅ PASS: Property 3b - All 100 React.memo components recognized');
  propertyTestsPassed++;
} else {
  propertyTestsFailed++;
}

// Property Test 3: All React.forwardRef components should be recognized
console.log('Testing Property 3c: React.forwardRef components are recognized...');
let property3cFailed = false;
for (let i = 0; i < 100; i++) {
  try {
    const code = generateReactForwardRefComponent();
    const ast = parseCode(code);
    const declarations = findNodes(ast, 'VariableDeclaration');
    
    if (declarations.length === 0 || !isReactForwardRef(declarations[0])) {
      console.log(`❌ FAIL: Iteration ${i + 1} - isReactForwardRef should recognize: ${code}`);
      property3cFailed = true;
      break;
    }
  } catch (e) {
    console.log(`❌ FAIL: Iteration ${i + 1} - Error: ${e.message}`);
    property3cFailed = true;
    break;
  }
}
if (!property3cFailed) {
  console.log('✅ PASS: Property 3c - All 100 React.forwardRef components recognized');
  propertyTestsPassed++;
} else {
  propertyTestsFailed++;
}

// Property Test 4: isReactComponent recognizes all component types
console.log('Testing Property 3d: isReactComponent recognizes all types...');
let property3dFailed = false;
for (let i = 0; i < 100; i++) {
  try {
    const generators = [generateReactFCComponent, generateReactMemoComponent, generateReactForwardRefComponent];
    const generator = generators[Math.floor(Math.random() * generators.length)];
    const code = generator();
    const ast = parseCode(code);
    const declarations = findNodes(ast, 'VariableDeclaration');
    
    if (declarations.length === 0 || !isReactComponent(declarations[0])) {
      console.log(`❌ FAIL: Iteration ${i + 1} - isReactComponent should recognize: ${code}`);
      property3dFailed = true;
      break;
    }
  } catch (e) {
    console.log(`❌ FAIL: Iteration ${i + 1} - Error: ${e.message}`);
    property3dFailed = true;
    break;
  }
}
if (!property3dFailed) {
  console.log('✅ PASS: Property 3d - All 100 components recognized by isReactComponent');
  propertyTestsPassed++;
} else {
  propertyTestsFailed++;
}

console.log(`\n📊 Property Tests: ${propertyTestsPassed} passed, ${propertyTestsFailed} failed\n`);

// Summary
const totalPassed = passed + propertyTestsPassed;
const totalFailed = failed + propertyTestsFailed;
const totalTests = totalPassed + totalFailed;

console.log('═══════════════════════════════════════════════════════');
console.log(`📈 SUMMARY: ${totalPassed}/${totalTests} tests passed`);
console.log('═══════════════════════════════════════════════════════\n');

// Exit with appropriate code
process.exit(totalFailed > 0 ? 1 : 0);
