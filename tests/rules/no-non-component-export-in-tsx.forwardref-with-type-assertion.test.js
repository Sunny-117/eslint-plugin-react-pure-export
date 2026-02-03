/**
 * Tests for no-non-component-export-in-tsx rule
 * Testing forwardRef with type assertion (as) - Issue with InlinePopoverEditor
 */

const { ESLint } = require('eslint');

console.log('🧪 Testing no-non-component-export-in-tsx rule - forwardRef with type assertion...\n');

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
  
  console.log('📋 Testing forwardRef with type assertion:\n');
  
  // Test 1: Basic forwardRef without type assertion (should pass)
  try {
    const code1 = `
      import {forwardRef} from 'react';
      
      function Component_(props, ref) {
        return <div ref={ref}>Test</div>;
      }
      
      export const Component = forwardRef(Component_);
    `;
    const result1 = await lintCode(code1, 'test.tsx');
    if (result1.messages.length === 0) {
      console.log('✅ PASS: Basic forwardRef without type assertion');
      passed++;
    } else {
      console.log('❌ FAIL: Basic forwardRef should not trigger error');
      console.log('  Messages:', result1.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing basic forwardRef:', e.message);
    failed++;
  }
  
  // Test 2: forwardRef with simple type assertion (should pass)
  try {
    const code2 = `
      import {forwardRef, ForwardedRef} from 'react';
      
      function Component_(props, ref: ForwardedRef<HTMLDivElement>) {
        return <div ref={ref}>Test</div>;
      }
      
      export const Component = forwardRef(Component_) as React.ForwardRefExoticComponent<any>;
    `;
    const result2 = await lintCode(code2, 'test.tsx');
    if (result2.messages.length === 0) {
      console.log('✅ PASS: forwardRef with simple type assertion');
      passed++;
    } else {
      console.log('❌ FAIL: forwardRef with simple type assertion should not trigger error');
      console.log('  Messages:', result2.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing forwardRef with simple type assertion:', e.message);
    failed++;
  }
  
  // Test 3: forwardRef with generic type assertion (InlinePopoverEditor pattern)
  try {
    const code3 = `
      import {forwardRef, ForwardedRef} from 'react';
      
      interface Props<P> {
        value: P;
      }
      
      function Component_<P>(props: Props<P>, ref: ForwardedRef<HTMLDivElement>) {
        return <div ref={ref}>Test</div>;
      }
      
      export const Component = forwardRef(Component_) as <P>(
        props: Props<P> & { ref?: ForwardedRef<HTMLDivElement> }
      ) => React.ReactElement;
    `;
    const result3 = await lintCode(code3, 'test.tsx');
    if (result3.messages.length === 0) {
      console.log('✅ PASS: forwardRef with generic type assertion (InlinePopoverEditor pattern)');
      passed++;
    } else {
      console.log('❌ FAIL: forwardRef with generic type assertion should not trigger error');
      console.log('  Messages:', result3.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing forwardRef with generic type assertion:', e.message);
    failed++;
  }
  
  // Test 4: Actual InlinePopoverEditor simplified pattern
  try {
    const code4 = `
      import {useImperativeHandle, ForwardedRef, forwardRef} from 'react';
      
      export interface InlinePopoverEditorProps<P extends unknown> {
        renderEditor: React.ComponentType<P>;
      }
      
      function InlinePopoverEditor_<P>(
        props: InlinePopoverEditorProps<P> & P,
        ref: ForwardedRef<{openEditor: () => void}>
      ) {
        return <div>Editor</div>;
      }
      
      export const InlinePopoverEditor = forwardRef(InlinePopoverEditor_) as <P>(
        props: InlinePopoverEditorProps<P> & P & {
          ref?: ForwardedRef<{openEditor: () => void}>;
        }
      ) => React.ReactElement;
    `;
    const result4 = await lintCode(code4, 'test.tsx');
    if (result4.messages.length === 0) {
      console.log('✅ PASS: InlinePopoverEditor simplified pattern');
      passed++;
    } else {
      console.log('❌ FAIL: InlinePopoverEditor pattern should not trigger error');
      console.log('  Messages:', result4.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing InlinePopoverEditor pattern:', e.message);
    failed++;
  }
  
  // Test 5: React.memo with type assertion (should pass)
  try {
    const code5 = `
      import {memo} from 'react';
      
      function Component_(props) {
        return <div>Test</div>;
      }
      
      export const Component = memo(Component_) as React.MemoExoticComponent<any>;
    `;
    const result5 = await lintCode(code5, 'test.tsx');
    if (result5.messages.length === 0) {
      console.log('✅ PASS: React.memo with type assertion');
      passed++;
    } else {
      console.log('❌ FAIL: React.memo with type assertion should not trigger error');
      console.log('  Messages:', result5.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing React.memo with type assertion:', e.message);
    failed++;
  }
  
  // Test 6: Non-component with type assertion (should fail)
  try {
    const code6 = `
      const helper = () => 42;
      export const Component = helper as any;
    `;
    const result6 = await lintCode(code6, 'test.tsx');
    if (result6.messages.length > 0 && 
        result6.messages[0].messageId === 'nonComponentExport') {
      console.log('✅ PASS: Non-component with type assertion triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Non-component with type assertion should trigger error');
      console.log('  Messages:', result6.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing non-component with type assertion:', e.message);
    failed++;
  }
  
  // Test 7: Type assertion on non-React function (should fail)
  try {
    const code7 = `
      function calculate() {
        return 42;
      }
      export const Component = calculate as any;
    `;
    const result7 = await lintCode(code7, 'test.tsx');
    if (result7.messages.length > 0 && 
        result7.messages[0].messageId === 'nonComponentExport') {
      console.log('✅ PASS: Type assertion on non-React function triggers error');
      passed++;
    } else {
      console.log('❌ FAIL: Type assertion on non-React function should trigger error');
      console.log('  Messages:', result7.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing type assertion on non-React function:', e.message);
    failed++;
  }
  
  // Test 8: HOC with type assertion (should pass)
  try {
    const code8 = `
      import {memo} from 'react';
      
      const withBoundary = (Component) => (props) => <div><Component {...props} /></div>;
      
      function Component_(props) {
        return <div>Test</div>;
      }
      
      export const Component = withBoundary(memo(Component_)) as React.ComponentType<any>;
    `;
    const result8 = await lintCode(code8, 'test.tsx');
    if (result8.messages.length === 0) {
      console.log('✅ PASS: HOC with type assertion');
      passed++;
    } else {
      console.log('❌ FAIL: HOC with type assertion should not trigger error');
      console.log('  Messages:', result8.messages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing HOC with type assertion:', e.message);
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
    console.log('✨ All tests passed!\n');
    process.exit(0);
  } else {
    console.log(`⚠️  ${failed} test(s) failed\n`);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Test execution failed:', err);
  process.exit(1);
});
