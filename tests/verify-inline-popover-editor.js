/**
 * Verify that InlinePopoverEditor pattern is correctly recognized
 * This test uses the actual InlinePopoverEditor code pattern inline
 */

const { ESLint } = require('eslint');

console.log('🧪 Verifying InlinePopoverEditor pattern...\n');

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
      'react-pure-export': require('../lib/index')
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

async function verifyPattern() {
  let passed = 0;
  let failed = 0;
  
  console.log('📋 Testing InlinePopoverEditor-like patterns:\n');
  
  // Test 1: Simplified InlinePopoverEditor pattern
  try {
    const code1 = `
      import {useImperativeHandle, ForwardedRef, forwardRef} from 'react';
      import {Popover} from '@baidu/one-ui';
      
      export interface InlinePopoverEditorProps<P extends unknown> {
        renderEditor: React.ComponentType<P>;
        disabled?: string | boolean;
      }
      
      function InlinePopoverEditor_<P>(
        props: InlinePopoverEditorProps<P> & P,
        ref: ForwardedRef<{openEditor: () => void, closeEditor: () => void}>
      ) {
        return (
          <Popover>
            <div>Editor</div>
          </Popover>
        );
      }
      
      export const InlinePopoverEditor = forwardRef(InlinePopoverEditor_) as <P>(
        props: InlinePopoverEditorProps<P> & P & {
          ref?: ForwardedRef<{openEditor: () => void, closeEditor: () => void}>;
        }
      ) => React.ReactElement;
    `;
    
    const result1 = await lintCode(code1, 'InlinePopoverEditor.tsx');
    const ruleMessages = result1.messages.filter(
      msg => msg.ruleId === 'react-pure-export/no-non-component-export-in-tsx'
    );
    
    if (ruleMessages.length === 0) {
      console.log('✅ PASS: InlinePopoverEditor pattern with generic type assertion');
      passed++;
    } else {
      console.log('❌ FAIL: InlinePopoverEditor pattern should not trigger error');
      console.log('  Messages:', ruleMessages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing InlinePopoverEditor pattern:', e.message);
    failed++;
  }
  
  // Test 2: Full InlinePopoverEditor pattern with more complexity
  try {
    const code2 = `
      import {useImperativeHandle, ForwardedRef, forwardRef, useCallback} from 'react';
      import {IconEdit} from 'dls-icons-react';
      import {Popover, PopoverProps, Tooltip} from '@baidu/one-ui';
      import {useBoolean} from 'huse';
      import {useEffect, useMemo, useRef} from 'react';
      
      export interface InlinePopoverEditorProps<P extends unknown> {
        renderEditor: React.ComponentType<P & {closeEditor: () => void}>;
        slots?: {
          trigger?: React.ComponentType<{onClick: () => void}>;
        };
        onPopoverCloseEditor?: () => void;
        disabled?: string | boolean;
        placement?: PopoverProps['placement'];
        editorSlots: Record<string, any>;
      }
      
      function InlinePopoverEditor_<P>(
        {
          renderEditor: Editor,
          slots,
          onPopoverCloseEditor,
          disabled,
          placement = 'rightTop',
          editorSlots,
          ...editorProps
        }: InlinePopoverEditorProps<P> & P,
        ref: ForwardedRef<{openEditor: () => void, closeEditor: () => void}>
      ) {
        const [visible, {on, off}] = useBoolean(false);
        
        const openEditor = useCallback(() => {
          on();
        }, [on]);
        
        const closeEditor = useCallback(() => {
          off();
        }, [off]);
        
        useImperativeHandle(ref, () => ({openEditor, closeEditor}));
        
        return (
          <Popover visible={visible}>
            <div onClick={openEditor}>
              <IconEdit />
            </div>
          </Popover>
        );
      }
      
      export const InlinePopoverEditor = forwardRef(InlinePopoverEditor_) as <P>(
        props: InlinePopoverEditorProps<P> & P & {
          ref?: ForwardedRef<{openEditor: () => void, closeEditor: () => void}>;
        }
      ) => React.ReactElement;
      
      function DefaultEditTrigger({disabled, onClick}: {disabled?: string | boolean, onClick: () => void}) {
        return (
          <Tooltip title={typeof disabled === 'string' ? disabled : ''}>
            <IconEdit onClick={onClick} />
          </Tooltip>
        );
      }
    `;
    
    const result2 = await lintCode(code2, 'InlinePopoverEditor.tsx');
    const ruleMessages = result2.messages.filter(
      msg => msg.ruleId === 'react-pure-export/no-non-component-export-in-tsx'
    );
    
    if (ruleMessages.length === 0) {
      console.log('✅ PASS: Full InlinePopoverEditor pattern with complex implementation');
      passed++;
    } else {
      console.log('❌ FAIL: Full InlinePopoverEditor pattern should not trigger error');
      console.log('  Messages:', ruleMessages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing full InlinePopoverEditor pattern:', e.message);
    failed++;
  }
  
  // Test 3: Similar pattern with different component name
  try {
    const code3 = `
      import {forwardRef, ForwardedRef} from 'react';
      
      interface CustomEditorProps<T> {
        value: T;
        onChange: (value: T) => void;
      }
      
      function CustomEditor_<T>(
        props: CustomEditorProps<T>,
        ref: ForwardedRef<HTMLDivElement>
      ) {
        return <div ref={ref}>Custom Editor</div>;
      }
      
      export const CustomEditor = forwardRef(CustomEditor_) as <T>(
        props: CustomEditorProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
      ) => React.ReactElement;
    `;
    
    const result3 = await lintCode(code3, 'CustomEditor.tsx');
    const ruleMessages = result3.messages.filter(
      msg => msg.ruleId === 'react-pure-export/no-non-component-export-in-tsx'
    );
    
    if (ruleMessages.length === 0) {
      console.log('✅ PASS: Similar generic forwardRef pattern with different name');
      passed++;
    } else {
      console.log('❌ FAIL: Similar pattern should not trigger error');
      console.log('  Messages:', ruleMessages);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing similar pattern:', e.message);
    failed++;
  }
  
  // Summary
  const total = passed + failed;
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`📈 SUMMARY: ${passed}/${total} tests passed`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  return { passed, failed };
}

verifyPattern().then(result => {
  const { passed, failed } = result;
  if (failed === 0) {
    console.log('✨ All InlinePopoverEditor patterns verified successfully!\n');
    process.exit(0);
  } else {
    console.log(`⚠️  ${failed} pattern(s) failed verification\n`);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
