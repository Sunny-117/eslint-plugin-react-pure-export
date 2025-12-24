/**
 * Property-based tests for plugin entry point
 * 
 * Property 12: All rules have complete metadata
 * Validates: Requirements 5.1, 5.2, 5.3
 * 
 * Property 13: Error messages use predefined message IDs
 * Validates: Requirements 5.4
 */

const { ESLint } = require('eslint');
const plugin = require('../../lib/index');

console.log('🧪 Property-based tests for plugin entry point...\n');

/**
 * Generate random export code that should trigger errors
 */
function generateRandomViolation(ruleType) {
  const randomName = 'Item' + Math.random().toString(36).substring(7);
  
  switch (ruleType) {
    case 'no-non-component-export-in-tsx':
      const exportTypes = ['const', 'function', 'let', 'var'];
      const type = exportTypes[Math.floor(Math.random() * exportTypes.length)];
      if (type === 'function') {
        return `export function ${randomName}() { return ${Math.random() * 100}; }`;
      } else {
        return `export ${type} ${randomName} = ${Math.random() * 100};`;
      }
    
    case 'no-tsx-import-in-pure-module':
      const randomPath = './components/' + randomName + '.tsx';
      return `import { ${randomName} } from "${randomPath}";`;
    
    case 'no-heavy-deps-in-pure-module':
      const heavyDeps = ['react', 'react-dom'];
      const dep = heavyDeps[Math.floor(Math.random() * heavyDeps.length)];
      return `import ${randomName} from "${dep}";`;
    
    default:
      return '';
  }
}

/**
 * Get file path for rule type
 */
function getFilePath(ruleType) {
  switch (ruleType) {
    case 'no-non-component-export-in-tsx':
      return 'test.tsx';
    case 'no-tsx-import-in-pure-module':
      return 'helpers.pure.ts';
    case 'no-heavy-deps-in-pure-module':
      return 'utils.pure.ts';
    default:
      return 'test.ts';
  }
}

async function runPropertyTests() {
  let passed = 0;
  let failed = 0;
  
  console.log('📋 Property 12: All rules have complete metadata\n');
  
  // Property 12: Test that all rules have complete metadata
  try {
    const rules = plugin.rules;
    const ruleNames = Object.keys(rules);
    
    console.log(`Testing ${ruleNames.length} rules for complete metadata...\n`);
    
    let allValid = true;
    const issues = [];
    
    for (const ruleName of ruleNames) {
      const rule = rules[ruleName];
      
      // Check meta exists
      if (!rule.meta) {
        issues.push(`${ruleName}: Missing meta object`);
        allValid = false;
        continue;
      }
      
      // Check docs.description
      if (!rule.meta.docs || 
          typeof rule.meta.docs.description !== 'string' ||
          rule.meta.docs.description.length === 0) {
        issues.push(`${ruleName}: Missing or invalid meta.docs.description`);
        allValid = false;
      }
      
      // Check messages
      if (!rule.meta.messages || 
          typeof rule.meta.messages !== 'object' ||
          Object.keys(rule.meta.messages).length === 0) {
        issues.push(`${ruleName}: Missing or empty meta.messages`);
        allValid = false;
      }
      
      // Check recommended level
      if (!rule.meta.docs || rule.meta.docs.recommended !== 'error') {
        issues.push(`${ruleName}: Recommended level should be 'error', got '${rule.meta.docs?.recommended}'`);
        allValid = false;
      }
    }
    
    if (allValid) {
      console.log('✅ PASS: Property 12 - All rules have complete metadata');
      console.log(`  Verified ${ruleNames.length} rules`);
      passed++;
    } else {
      console.log('❌ FAIL: Property 12 - Some rules have incomplete metadata');
      issues.forEach(issue => console.log(`  - ${issue}`));
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Property 12 - Error testing metadata:', e.message);
    failed++;
  }
  
  console.log('\n📋 Property 13: Error messages use predefined message IDs\n');
  
  // Property 13: Test that all error messages use predefined message IDs
  const iterations = 100;
  console.log(`Running ${iterations} iterations per rule...\n`);
  
  const rulesToTest = [
    'no-non-component-export-in-tsx',
    'no-tsx-import-in-pure-module',
    'no-heavy-deps-in-pure-module'
  ];
  
  for (const ruleName of rulesToTest) {
    try {
      const rule = plugin.rules[ruleName];
      const validMessageIds = Object.keys(rule.meta.messages);
      
      const eslint = new ESLint({
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
            [`react-pure-export/${ruleName}`]: 'error'
          }
        },
        plugins: {
          'react-pure-export': plugin
        }
      });
      
      let allValid = true;
      const invalidMessageIds = [];
      
      for (let i = 0; i < iterations; i++) {
        const code = generateRandomViolation(ruleName);
        const filePath = getFilePath(ruleName);
        
        const results = await eslint.lintText(code, { filePath });
        const messages = results[0].messages;
        
        for (const msg of messages) {
          if (!validMessageIds.includes(msg.messageId)) {
            invalidMessageIds.push({
              iteration: i,
              messageId: msg.messageId,
              code: code
            });
            allValid = false;
          }
        }
      }
      
      if (allValid) {
        console.log(`✅ PASS: ${ruleName} - All message IDs are valid (${iterations} iterations)`);
        passed++;
      } else {
        console.log(`❌ FAIL: ${ruleName} - Found invalid message IDs`);
        console.log(`  Valid IDs: ${validMessageIds.join(', ')}`);
        console.log(`  Invalid messages found: ${invalidMessageIds.length}`);
        invalidMessageIds.slice(0, 3).forEach(item => {
          console.log(`    - Iteration ${item.iteration}: ${item.messageId}`);
        });
        failed++;
      }
    } catch (e) {
      console.log(`❌ FAIL: ${ruleName} - Error testing message IDs:`, e.message);
      failed++;
    }
  }
  
  // Summary
  const total = passed + failed;
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`📈 SUMMARY: ${passed}/${total} property tests passed`);
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
  console.error('❌ Property test execution failed:', err);
  process.exit(1);
});
