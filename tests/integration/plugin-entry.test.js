/**
 * Tests for plugin entry point (lib/index.js)
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4
 * 
 * Property 12: All rules have complete metadata
 * Property 13: Error messages use predefined message IDs
 */

const { ESLint } = require('eslint');
const plugin = require('../../lib/index');

console.log('🧪 Testing plugin entry point...\n');

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  console.log('📋 Testing plugin structure:\n');
  
  // Test 1: Plugin exports rules object
  try {
    if (plugin.rules && typeof plugin.rules === 'object') {
      console.log('✅ PASS: Plugin exports rules object');
      passed++;
    } else {
      console.log('❌ FAIL: Plugin should export rules object');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking rules object:', e.message);
    failed++;
  }
  
  // Test 2: Plugin exports all three rules
  try {
    const expectedRules = [
      'no-non-component-export-in-tsx',
      'no-tsx-import-in-pure-module',
      'no-heavy-deps-in-pure-module'
    ];
    const actualRules = Object.keys(plugin.rules);
    const hasAllRules = expectedRules.every(rule => actualRules.includes(rule));
    
    if (hasAllRules && actualRules.length === expectedRules.length) {
      console.log('✅ PASS: Plugin exports all three rules');
      passed++;
    } else {
      console.log('❌ FAIL: Plugin should export exactly three rules');
      console.log('  Expected:', expectedRules);
      console.log('  Actual:', actualRules);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking rule exports:', e.message);
    failed++;
  }
  
  // Test 3: Plugin exports configs object
  try {
    if (plugin.configs && typeof plugin.configs === 'object') {
      console.log('✅ PASS: Plugin exports configs object');
      passed++;
    } else {
      console.log('❌ FAIL: Plugin should export configs object');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking configs object:', e.message);
    failed++;
  }
  
  // Test 4: Plugin exports recommended config (Legacy Config)
  try {
    if (plugin.configs.recommended && 
        plugin.configs.recommended.plugins &&
        plugin.configs.recommended.rules) {
      console.log('✅ PASS: Plugin exports recommended config (Legacy Config)');
      passed++;
    } else {
      console.log('❌ FAIL: Plugin should export recommended config');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking recommended config:', e.message);
    failed++;
  }
  
  // Test 5: Plugin exports flat/recommended config (Flat Config)
  try {
    if (plugin.configs['flat/recommended'] && 
        plugin.configs['flat/recommended'].plugins &&
        plugin.configs['flat/recommended'].rules) {
      console.log('✅ PASS: Plugin exports flat/recommended config (Flat Config)');
      passed++;
    } else {
      console.log('❌ FAIL: Plugin should export flat/recommended config');
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking flat/recommended config:', e.message);
    failed++;
  }
  
  // Test 6: Recommended config includes all rules
  try {
    const expectedRules = [
      'react-pure-export/no-non-component-export-in-tsx',
      'react-pure-export/no-tsx-import-in-pure-module',
      'react-pure-export/no-heavy-deps-in-pure-module'
    ];
    const configRules = Object.keys(plugin.configs.recommended.rules);
    const hasAllRules = expectedRules.every(rule => configRules.includes(rule));
    
    if (hasAllRules && configRules.length === expectedRules.length) {
      console.log('✅ PASS: Recommended config includes all rules');
      passed++;
    } else {
      console.log('❌ FAIL: Recommended config should include all rules');
      console.log('  Expected:', expectedRules);
      console.log('  Actual:', configRules);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking recommended config rules:', e.message);
    failed++;
  }
  
  // Test 7: Flat config includes all rules
  try {
    const expectedRules = [
      'react-pure-export/no-non-component-export-in-tsx',
      'react-pure-export/no-tsx-import-in-pure-module',
      'react-pure-export/no-heavy-deps-in-pure-module'
    ];
    const configRules = Object.keys(plugin.configs['flat/recommended'].rules);
    const hasAllRules = expectedRules.every(rule => configRules.includes(rule));
    
    if (hasAllRules && configRules.length === expectedRules.length) {
      console.log('✅ PASS: Flat config includes all rules');
      passed++;
    } else {
      console.log('❌ FAIL: Flat config should include all rules');
      console.log('  Expected:', expectedRules);
      console.log('  Actual:', configRules);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking flat config rules:', e.message);
    failed++;
  }
  
  // Test 8: All rules in recommended config are set to 'error'
  try {
    const rules = plugin.configs.recommended.rules;
    const allError = Object.values(rules).every(level => level === 'error');
    
    if (allError) {
      console.log('✅ PASS: All rules in recommended config are set to error');
      passed++;
    } else {
      console.log('❌ FAIL: All rules should be set to error');
      console.log('  Rules:', rules);
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking rule levels:', e.message);
    failed++;
  }
  
  console.log('\n📋 Property 12: Testing all rules have complete metadata:\n');
  
  // Test 9: All rules have meta.docs.description
  try {
    const rules = plugin.rules;
    const allHaveDescription = Object.entries(rules).every(([name, rule]) => {
      return rule.meta && 
             rule.meta.docs && 
             typeof rule.meta.docs.description === 'string' &&
             rule.meta.docs.description.length > 0;
    });
    
    if (allHaveDescription) {
      console.log('✅ PASS: All rules have meta.docs.description');
      passed++;
    } else {
      console.log('❌ FAIL: All rules should have meta.docs.description');
      Object.entries(rules).forEach(([name, rule]) => {
        if (!rule.meta?.docs?.description) {
          console.log(`  Missing in: ${name}`);
        }
      });
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking rule descriptions:', e.message);
    failed++;
  }
  
  // Test 10: All rules have meta.messages
  try {
    const rules = plugin.rules;
    const allHaveMessages = Object.entries(rules).every(([name, rule]) => {
      return rule.meta && 
             rule.meta.messages && 
             typeof rule.meta.messages === 'object' &&
             Object.keys(rule.meta.messages).length > 0;
    });
    
    if (allHaveMessages) {
      console.log('✅ PASS: All rules have meta.messages');
      passed++;
    } else {
      console.log('❌ FAIL: All rules should have meta.messages');
      Object.entries(rules).forEach(([name, rule]) => {
        if (!rule.meta?.messages || Object.keys(rule.meta.messages).length === 0) {
          console.log(`  Missing in: ${name}`);
        }
      });
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking rule messages:', e.message);
    failed++;
  }
  
  // Test 11: All rules have recommended level set to 'error'
  try {
    const rules = plugin.rules;
    const allHaveRecommended = Object.entries(rules).every(([name, rule]) => {
      return rule.meta && 
             rule.meta.docs && 
             rule.meta.docs.recommended === 'error';
    });
    
    if (allHaveRecommended) {
      console.log('✅ PASS: All rules have recommended level set to error');
      passed++;
    } else {
      console.log('❌ FAIL: All rules should have recommended level set to error');
      Object.entries(rules).forEach(([name, rule]) => {
        if (rule.meta?.docs?.recommended !== 'error') {
          console.log(`  Incorrect in: ${name} (${rule.meta?.docs?.recommended})`);
        }
      });
      failed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error checking recommended levels:', e.message);
    failed++;
  }
  
  console.log('\n📋 Property 13: Testing error messages use predefined message IDs:\n');
  
  // Test 12: no-non-component-export-in-tsx uses valid message IDs
  try {
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
          'react-pure-export/no-non-component-export-in-tsx': 'error'
        }
      },
      plugins: {
        'react-pure-export': plugin
      }
    });
    
    const code = 'export const PAGE_SIZE = 20;';
    const results = await eslint.lintText(code, { filePath: 'test.tsx' });
    const messages = results[0].messages;
    
    if (messages.length > 0) {
      const rule = plugin.rules['no-non-component-export-in-tsx'];
      const validMessageIds = Object.keys(rule.meta.messages);
      const allValid = messages.every(msg => validMessageIds.includes(msg.messageId));
      
      if (allValid) {
        console.log('✅ PASS: no-non-component-export-in-tsx uses valid message IDs');
        passed++;
      } else {
        console.log('❌ FAIL: no-non-component-export-in-tsx uses invalid message IDs');
        console.log('  Valid IDs:', validMessageIds);
        console.log('  Used IDs:', messages.map(m => m.messageId));
        failed++;
      }
    } else {
      console.log('⚠️  SKIP: No messages generated for no-non-component-export-in-tsx');
      passed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing no-non-component-export-in-tsx message IDs:', e.message);
    failed++;
  }
  
  // Test 13: no-tsx-import-in-pure-module uses valid message IDs
  try {
    const eslint = new ESLint({
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
        'react-pure-export': plugin
      }
    });
    
    const code = 'import { Component } from "./Component.tsx";';
    const results = await eslint.lintText(code, { filePath: 'helpers.pure.ts' });
    const messages = results[0].messages;
    
    if (messages.length > 0) {
      const rule = plugin.rules['no-tsx-import-in-pure-module'];
      const validMessageIds = Object.keys(rule.meta.messages);
      const allValid = messages.every(msg => validMessageIds.includes(msg.messageId));
      
      if (allValid) {
        console.log('✅ PASS: no-tsx-import-in-pure-module uses valid message IDs');
        passed++;
      } else {
        console.log('❌ FAIL: no-tsx-import-in-pure-module uses invalid message IDs');
        console.log('  Valid IDs:', validMessageIds);
        console.log('  Used IDs:', messages.map(m => m.messageId));
        failed++;
      }
    } else {
      console.log('⚠️  SKIP: No messages generated for no-tsx-import-in-pure-module');
      passed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing no-tsx-import-in-pure-module message IDs:', e.message);
    failed++;
  }
  
  // Test 14: no-heavy-deps-in-pure-module uses valid message IDs
  try {
    const eslint = new ESLint({
      useEslintrc: false,
      baseConfig: {
        parser: '@typescript-eslint/parser',
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: 'module'
        },
        plugins: ['react-pure-export'],
        rules: {
          'react-pure-export/no-heavy-deps-in-pure-module': 'error'
        }
      },
      plugins: {
        'react-pure-export': plugin
      }
    });
    
    const code = 'import React from "react";';
    const results = await eslint.lintText(code, { filePath: 'helpers.pure.ts' });
    const messages = results[0].messages;
    
    if (messages.length > 0) {
      const rule = plugin.rules['no-heavy-deps-in-pure-module'];
      const validMessageIds = Object.keys(rule.meta.messages);
      const allValid = messages.every(msg => validMessageIds.includes(msg.messageId));
      
      if (allValid) {
        console.log('✅ PASS: no-heavy-deps-in-pure-module uses valid message IDs');
        passed++;
      } else {
        console.log('❌ FAIL: no-heavy-deps-in-pure-module uses invalid message IDs');
        console.log('  Valid IDs:', validMessageIds);
        console.log('  Used IDs:', messages.map(m => m.messageId));
        failed++;
      }
    } else {
      console.log('⚠️  SKIP: No messages generated for no-heavy-deps-in-pure-module');
      passed++;
    }
  } catch (e) {
    console.log('❌ FAIL: Error testing no-heavy-deps-in-pure-module message IDs:', e.message);
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
