/**
 * @fileoverview Tests for no-tsx-import-in-pure-module rule - Path alias support
 * Tests that the rule correctly resolves TypeScript path aliases from tsconfig.json
 */

'use strict';

const rule = require('../../lib/rules/no-tsx-import-in-pure-module');
const {RuleTester} = require('eslint');
const path = require('path');

const ruleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
});

console.log('🧪 Testing no-tsx-import-in-pure-module rule with path aliases...\n');

// Note: These tests use the actual playground tsconfig.json which has path aliases configured
const playgroundPath = path.resolve(__dirname, '../../playground/src/utils/test.ts');

ruleTester.run('no-tsx-import-in-pure-module (path aliases from tsconfig)', rule, {
    valid: [
        {
            // Path alias to .ts file should be allowed
            code: `import { pureFunction } from '@/utils/helpers.pure';`,
            filename: playgroundPath,
        },
        {
            // Path alias to .ts file with @components should be allowed
            code: `import { helper } from '@utils/helpers.pure';`,
            filename: playgroundPath,
        },
        {
            // Relative import to .ts file should be allowed
            code: `import { helper } from './helpers.pure';`,
            filename: playgroundPath,
        },
        {
            // npm package import should be allowed
            code: `import React from 'react';`,
            filename: playgroundPath,
        },
    ],
    invalid: [
        {
            // Path alias @/ to .tsx file should error
            code: `import { ValidFC } from '@/components/ValidComponent';`,
            filename: playgroundPath,
            errors: [{
                messageId: 'tsxImportInPureModule',
            }],
        },
        {
            // Path alias @components/ to .tsx file should error
            code: `import { ValidFC } from '@components/ValidComponent';`,
            filename: playgroundPath,
            errors: [{
                messageId: 'tsxImportInPureModule',
            }],
        },
        {
            // Path alias with explicit .tsx extension should error
            code: `import { ValidFC } from '@/components/ValidComponent.tsx';`,
            filename: playgroundPath,
            errors: [{
                messageId: 'tsxImportInPureModule',
            }],
        },
        {
            // Relative import to .tsx file should error
            code: `import { ValidFC } from '../components/ValidComponent';`,
            filename: playgroundPath,
            errors: [{
                messageId: 'tsxImportInPureModule',
            }],
        },
        {
            // Relative import with explicit .tsx should error
            code: `import { ValidFC } from '../components/ValidComponent.tsx';`,
            filename: playgroundPath,
            errors: [{
                messageId: 'tsxImportInPureModule',
            }],
        },
    ],
});

console.log('\n✅ All path alias tests (from tsconfig) passed!\n');

// Test custom path aliases from ESLint config
const projectRoot = path.resolve(__dirname, '../..');

ruleTester.run('no-tsx-import-in-pure-module (custom path aliases from ESLint config)', rule, {
    valid: [
        {
            // Custom alias to .ts file should be allowed
            code: `import { pureFunction } from '@custom/utils/helpers.pure';`,
            filename: playgroundPath,
            options: [{
                pathAliases: {
                    '@custom': path.join(projectRoot, 'playground/src'),
                }
            }],
        },
        {
            // Multiple custom aliases
            code: `import { helper } from '@myutils/helpers.pure';`,
            filename: playgroundPath,
            options: [{
                pathAliases: {
                    '@myutils': path.join(projectRoot, 'playground/src/utils'),
                    '@mycomponents': path.join(projectRoot, 'playground/src/components'),
                }
            }],
        },
    ],
    invalid: [
        {
            // Custom alias to .tsx file should error
            code: `import { ValidFC } from '@custom/components/ValidComponent';`,
            filename: playgroundPath,
            options: [{
                pathAliases: {
                    '@custom': path.join(projectRoot, 'playground/src'),
                }
            }],
            errors: [{
                messageId: 'tsxImportInPureModule',
            }],
        },
        {
            // Multiple custom aliases - error case
            code: `import { ValidFC } from '@mycomponents/ValidComponent';`,
            filename: playgroundPath,
            options: [{
                pathAliases: {
                    '@myutils': path.join(projectRoot, 'playground/src/utils'),
                    '@mycomponents': path.join(projectRoot, 'playground/src/components'),
                }
            }],
            errors: [{
                messageId: 'tsxImportInPureModule',
            }],
        },
        {
            // Custom alias overrides tsconfig
            code: `import { ValidFC } from '@override/ValidComponent';`,
            filename: playgroundPath,
            options: [{
                pathAliases: {
                    '@override': path.join(projectRoot, 'playground/src/components'),
                }
            }],
            errors: [{
                messageId: 'tsxImportInPureModule',
            }],
        },
    ],
});

console.log('\n✅ All custom path alias tests (from ESLint config) passed!\n');
