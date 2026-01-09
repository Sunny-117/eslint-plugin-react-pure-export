/**
 * @fileoverview Tests for no-non-component-export-in-tsx rule - JSX usage cases
 * Tests that exports containing JSX syntax are allowed even if they're not React components
 */

'use strict';

const rule = require('../../lib/rules/no-non-component-export-in-tsx');
const {RuleTester} = require('eslint');

const ruleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('no-non-component-export-in-tsx (JSX usage)', rule, {
    valid: [
        {
            // Function that returns JSX should be allowed
            code: `
                export function getEditor() {
                    return <div>Editor</div>;
                }
            `,
            filename: 'test.tsx',
        },
        {
            // Arrow function that returns JSX should be allowed
            code: `
                export const getEditor = () => {
                    return <div>Editor</div>;
                };
            `,
            filename: 'test.tsx',
        },
        {
            // Function with JSX in body should be allowed
            code: `
                export function renderContent() {
                    const element = <span>Content</span>;
                    return element;
                }
            `,
            filename: 'test.tsx',
        },
        {
            // Object/config containing JSX should be allowed
            code: `
                export const config = {
                    title: 'Test',
                    render: () => <div>Test</div>
                };
            `,
            filename: 'test.tsx',
        },
        {
            // Array containing JSX should be allowed
            code: `
                export const items = [
                    <div key="1">Item 1</div>,
                    <div key="2">Item 2</div>
                ];
            `,
            filename: 'test.tsx',
        },
        {
            // Variable with JSX element should be allowed
            code: `
                export const element = <div>Hello</div>;
            `,
            filename: 'test.tsx',
        },
        {
            // Complex config with nested JSX should be allowed
            code: `
                export const tableConfig = {
                    columns: [
                        {
                            title: 'Name',
                            render: (text) => <span>{text}</span>
                        }
                    ]
                };
            `,
            filename: 'test.tsx',
        },
        {
            // Destructured export with inline JSX should be allowed
            code: `
                export const { editor, viewer } = {
                    editor: <div>Editor</div>,
                    viewer: <div>Viewer</div>
                };
            `,
            filename: 'test.tsx',
        },
    ],
    invalid: [
        {
            // Pure function without JSX should still be invalid
            code: `
                export function calculate(a, b) {
                    return a + b;
                }
            `,
            filename: 'test.tsx',
            errors: [{messageId: 'nonComponentExport'}],
            output: `
                // TODO: Create calculate.ts with:
// export function calculate(a, b) {
//                     return a + b;
//                 }
import { calculate } from './calculate';

            `,
        },
        {
            // Pure constant without JSX should still be invalid
            code: `
                export const API_URL = 'https://api.example.com';
            `,
            filename: 'test.tsx',
            errors: [{messageId: 'nonComponentExport'}],
            output: `
                // TODO: Create api-url.ts with:
// export const API_URL = 'https://api.example.com';
import { API_URL } from './api-url';

            `,
        },
        {
            // Object without JSX should still be invalid
            code: `
                export const config = {
                    timeout: 3000,
                    retries: 3
                };
            `,
            filename: 'test.tsx',
            errors: [{messageId: 'nonComponentExport'}],
            output: `
                // TODO: Create config.ts with:
// export const config = {
//                     timeout: 3000,
//                     retries: 3
//                 };
import { config } from './config';

            `,
        },
        {
            // Function that only manipulates strings should still be invalid
            code: `
                export function formatText(text) {
                    return text.toUpperCase();
                }
            `,
            filename: 'test.tsx',
            errors: [{messageId: 'nonComponentExport'}],
            output: `
                // TODO: Create format-text.ts with:
// export function formatText(text) {
//                     return text.toUpperCase();
//                 }
import { formatText } from './format-text';

            `,
        },
    ],
});

console.log('All JSX usage tests passed!');
