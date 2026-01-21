/**
 * Tests for no-non-component-export-in-tsx rule - HOC (Higher-Order Component) support
 * Tests that components wrapped with HOCs like withBoundary, withRouter, etc. are recognized as components
 */

const { ESLint } = require('eslint');

console.log('🧪 Testing no-non-component-export-in-tsx rule - HOC support...\n');

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
  
  console.log('📋 Testing HOC-wrapped components are allowed:\n');
  
  // Test 1: withBoundary wrapped component (named export)
  try {
    const code1 = `
      import { withBoundary } from '@/components/ErrorBoundary';
      const MyComponent = () => <div>Hello</div>;
      export const WrappedComponent = withBoundary(MyComponent);
    `;
    const result1 = await lintCode(code1, 'test.tsx');
    if (result1.messages.length === 0) {
      console.log('✅ PASS: withBoundary wrapped component (named export) does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: withBoundary wrapped component (named export) should not trigger error');
      console.log('  Messages:', result1.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing withBoundary named export:', e.message);
    failed++;
  }
  
  // Test 2: withBoundary wrapped component (default export)
  try {
    const code2 = `
      import { withBoundary } from '@/components/ErrorBoundary';
      const MyComponent = () => <div>Hello</div>;
      export default withBoundary(MyComponent);
    `;
    const result2 = await lintCode(code2, 'test.tsx');
    if (result2.messages.length === 0) {
      console.log('✅ PASS: withBoundary wrapped component (default export) does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: withBoundary wrapped component (default export) should not trigger error');
      console.log('  Messages:', result2.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing withBoundary default export:', e.message);
    failed++;
  }
  
  // Test 3: withRouter wrapped component
  try {
    const code3 = `
      import { withRouter } from 'react-router-dom';
      const MyComponent = () => <div>Hello</div>;
      export const RoutedComponent = withRouter(MyComponent);
    `;
    const result3 = await lintCode(code3, 'test.tsx');
    if (result3.messages.length === 0) {
      console.log('✅ PASS: withRouter wrapped component does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: withRouter wrapped component should not trigger error');
      console.log('  Messages:', result3.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing withRouter:', e.message);
    failed++;
  }
  
  // Test 4: connect (Redux) wrapped component
  try {
    const code4 = `
      import { connect } from 'react-redux';
      const MyComponent = () => <div>Hello</div>;
      export const ConnectedComponent = connect()(MyComponent);
    `;
    const result4 = await lintCode(code4, 'test.tsx');
    if (result4.messages.length === 0) {
      console.log('✅ PASS: connect wrapped component does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: connect wrapped component should not trigger error');
      console.log('  Messages:', result4.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing connect:', e.message);
    failed++;
  }
  
  // Test 5: observer (MobX) wrapped component
  try {
    const code5 = `
      import { observer } from 'mobx-react';
      const MyComponent = () => <div>Hello</div>;
      export const ObservedComponent = observer(MyComponent);
    `;
    const result5 = await lintCode(code5, 'test.tsx');
    if (result5.messages.length === 0) {
      console.log('✅ PASS: observer wrapped component does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: observer wrapped component should not trigger error');
      console.log('  Messages:', result5.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing observer:', e.message);
    failed++;
  }
  
  // Test 6: Multiple HOCs chained
  try {
    const code6 = `
      import { withBoundary } from '@/components/ErrorBoundary';
      import { withRouter } from 'react-router-dom';
      const MyComponent = () => <div>Hello</div>;
      export default withBoundary(withRouter(MyComponent));
    `;
    const result6 = await lintCode(code6, 'test.tsx');
    if (result6.messages.length === 0) {
      console.log('✅ PASS: Multiple chained HOCs do not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Multiple chained HOCs should not trigger error');
      console.log('  Messages:', result6.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing chained HOCs:', e.message);
    failed++;
  }
  
  // Test 7: Inline component with withBoundary
  try {
    const code7 = `
      import { withBoundary } from '@/components/ErrorBoundary';
      export default withBoundary(() => <div>Hello</div>);
    `;
    const result7 = await lintCode(code7, 'test.tsx');
    if (result7.messages.length === 0) {
      console.log('✅ PASS: Inline component with withBoundary does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Inline component with withBoundary should not trigger error');
      console.log('  Messages:', result7.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing inline component with HOC:', e.message);
    failed++;
  }
  
  // Test 8: Custom HOC with 'with' prefix
  try {
    const code8 = `
      import { withAuth } from '@/hocs/withAuth';
      const MyComponent = () => <div>Protected</div>;
      export default withAuth(MyComponent);
    `;
    const result8 = await lintCode(code8, 'test.tsx');
    if (result8.messages.length === 0) {
      console.log('✅ PASS: Custom withAuth HOC does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: Custom withAuth HOC should not trigger error');
      console.log('  Messages:', result8.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing custom withAuth HOC:', e.message);
    failed++;
  }
  
  // Test 9: Custom HOC with different naming
  try {
    const code9 = `
      import { compose } from '@/utils/compose';
      const MyComponent = () => <div>Composed</div>;
      export default compose(MyComponent);
    `;
    const result9 = await lintCode(code9, 'test.tsx');
    if (result9.messages.length === 0) {
      console.log('✅ PASS: compose HOC does not trigger error');
      passed++;
    } else {
      console.log('❌ FAIL: compose HOC should not trigger error');
      console.log('  Messages:', result9.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing compose HOC:', e.message);
    failed++;
  }
  
  console.log('\n📋 Testing non-HOC exports still trigger errors:\n');
  
  // Test 10: Regular function should still error
  try {
    const code10 = `
      export const helper = () => 42;
    `;
    const result10 = await lintCode(code10, 'test.tsx');
    if (result10.messages.length > 0 && 
        result10.messages[0].messageId === 'nonComponentExport') {
      console.log('✅ PASS: Regular function still triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Regular function should still trigger error');
      console.log('  Messages:', result10.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing regular function:', e.message);
    failed++;
  }
  
  // Test 11: Constant should still error
  try {
    const code11 = `
      export const PAGE_SIZE = 20;
    `;
    const result11 = await lintCode(code11, 'test.tsx');
    if (result11.messages.length > 0 && 
        result11.messages[0].messageId === 'nonComponentExport') {
      console.log('✅ PASS: Constant still triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Constant should still trigger error');
      console.log('  Messages:', result11.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing constant:', e.message);
    failed++;
  }
  
  // Test 12: Function call without component argument should error
  try {
    const code12 = `
      import { withSomething } from '@/utils';
      export const result = withSomething(42);
    `;
    const result12 = await lintCode(code12, 'test.tsx');
    if (result12.messages.length > 0 && 
        result12.messages[0].messageId === 'nonComponentExport') {
      console.log('✅ PASS: withSomething(42) still triggers error (not a component argument)');
      passed++;
    } else {
      console.log('❌ FAIL: withSomething(42) should trigger error');
      console.log('  Messages:', result12.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing non-component HOC call:', e.message);
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
