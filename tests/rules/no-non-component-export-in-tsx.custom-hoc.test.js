/**
 * Tests for no-non-component-export-in-tsx rule - Custom HOC names
 * Tests that the heuristic-based detection works with any HOC naming pattern
 */

const { ESLint } = require('eslint');

console.log('🧪 Testing no-non-component-export-in-tsx rule - Custom HOC names...\n');

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
  
  console.log('📋 Testing custom HOC names with "with" prefix:\n');
  
  // Test 1: withAuth
  try {
    const code1 = `
      const MyComponent = () => <div>Protected</div>;
      export default withAuth(MyComponent);
    `;
    const result1 = await lintCode(code1, 'test.tsx');
    if (result1.messages.length === 0) {
      console.log('✅ PASS: withAuth(Component) recognized as HOC');
      passed++;
    } else {
      console.log('❌ FAIL: withAuth(Component) should be recognized as HOC');
      console.log('  Messages:', result1.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing withAuth:', e.message);
    failed++;
  }
  
  // Test 2: withPermissions
  try {
    const code2 = `
      const Dashboard = () => <div>Dashboard</div>;
      export const ProtectedDashboard = withPermissions(Dashboard);
    `;
    const result2 = await lintCode(code2, 'test.tsx');
    if (result2.messages.length === 0) {
      console.log('✅ PASS: withPermissions(Component) recognized as HOC');
      passed++;
    } else {
      console.log('❌ FAIL: withPermissions(Component) should be recognized as HOC');
      console.log('  Messages:', result2.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing withPermissions:', e.message);
    failed++;
  }
  
  // Test 3: withStyles
  try {
    const code3 = `
      const Button = () => <button>Click</button>;
      export default withStyles(Button);
    `;
    const result3 = await lintCode(code3, 'test.tsx');
    if (result3.messages.length === 0) {
      console.log('✅ PASS: withStyles(Component) recognized as HOC');
      passed++;
    } else {
      console.log('❌ FAIL: withStyles(Component) should be recognized as HOC');
      console.log('  Messages:', result3.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing withStyles:', e.message);
    failed++;
  }
  
  // Test 4: withData
  try {
    const code4 = `
      export const UserProfile = withData(() => <div>Profile</div>);
    `;
    const result4 = await lintCode(code4, 'test.tsx');
    if (result4.messages.length === 0) {
      console.log('✅ PASS: withData(inline component) recognized as HOC');
      passed++;
    } else {
      console.log('❌ FAIL: withData(inline component) should be recognized as HOC');
      console.log('  Messages:', result4.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing withData:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing known wrapper functions:\n');
  
  // Test 5: compose
  try {
    const code5 = `
      const MyComponent = () => <div>Composed</div>;
      export default compose(MyComponent);
    `;
    const result5 = await lintCode(code5, 'test.tsx');
    if (result5.messages.length === 0) {
      console.log('✅ PASS: compose(Component) recognized as HOC');
      passed++;
    } else {
      console.log('❌ FAIL: compose(Component) should be recognized as HOC');
      console.log('  Messages:', result5.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing compose:', e.message);
    failed++;
  }
  
  // Test 6: inject (MobX)
  try {
    const code6 = `
      const Store = () => <div>Store</div>;
      export const InjectedStore = inject('store')(Store);
    `;
    const result6 = await lintCode(code6, 'test.tsx');
    if (result6.messages.length === 0) {
      console.log('✅ PASS: inject()(Component) recognized as HOC');
      passed++;
    } else {
      console.log('❌ FAIL: inject()(Component) should be recognized as HOC');
      console.log('  Messages:', result6.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing inject:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing edge cases:\n');
  
  // Test 7: PascalCase component name as argument
  try {
    const code7 = `
      const MyButton = () => <button>Click</button>;
      export default withTheme(MyButton);
    `;
    const result7 = await lintCode(code7, 'test.tsx');
    if (result7.messages.length === 0) {
      console.log('✅ PASS: PascalCase component argument recognized');
      passed++;
    } else {
      console.log('❌ FAIL: PascalCase component argument should be recognized');
      console.log('  Messages:', result7.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing PascalCase argument:', e.message);
    failed++;
  }
  
  // Test 8: camelCase function should error (not a component)
  try {
    const code8 = `
      const myHelper = () => 42;
      export default withSomething(myHelper);
    `;
    const result8 = await lintCode(code8, 'test.tsx');
    if (result8.messages.length > 0 && 
        result8.messages[0].messageId === 'nonComponentExport') {
      console.log('✅ PASS: withSomething(camelCase) triggers error (not a component)');
      passed++;
    } else {
      console.log('❌ FAIL: withSomething(camelCase) should trigger error');
      console.log('  Messages:', result8.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing camelCase argument:', e.message);
    failed++;
  }
  
  // Test 9: Number argument should error
  try {
    const code9 = `
      export const result = withConfig(42);
    `;
    const result9 = await lintCode(code9, 'test.tsx');
    if (result9.messages.length > 0 && 
        result9.messages[0].messageId === 'nonComponentExport') {
      console.log('✅ PASS: withConfig(42) triggers error (not a component)');
      passed++;
    } else {
      console.log('❌ FAIL: withConfig(42) should trigger error');
      console.log('  Messages:', result9.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing number argument:', e.message);
    failed++;
  }
  
  // Test 10: String argument should error
  try {
    const code10 = `
      export const result = withValue('hello');
    `;
    const result10 = await lintCode(code10, 'test.tsx');
    if (result10.messages.length > 0 && 
        result10.messages[0].messageId === 'nonComponentExport') {
      console.log('✅ PASS: withValue("hello") triggers error (not a component)');
      passed++;
    } else {
      console.log('❌ FAIL: withValue("hello") should trigger error');
      console.log('  Messages:', result10.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing string argument:', e.message);
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
