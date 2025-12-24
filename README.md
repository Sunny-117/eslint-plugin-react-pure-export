# eslint-plugin-react-pure-export

[![npm version](https://img.shields.io/npm/v/eslint-plugin-react-pure-export.svg)](https://www.npmjs.com/package/eslint-plugin-react-pure-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An ESLint plugin to enforce separation between React components and pure logic modules, improving React Fast Refresh stability and code organization.

[中文文档](./README_CN.md)

## Motivation

In React projects, mixing component code with pure logic can lead to:

- **React Fast Refresh issues**: Non-component exports in `.tsx` files can break hot module replacement
- **Circular dependencies**: Components importing from files that import components
- **Performance problems**: Heavy dependencies (React, CSS) loaded in pure utility modules
- **Poor code organization**: Unclear boundaries between UI and business logic

This plugin enforces clear separation through three ESLint rules.

## Installation

```bash
npm install --save-dev eslint-plugin-react-pure-export
# or
yarn add --dev eslint-plugin-react-pure-export
# or
pnpm add --save-dev eslint-plugin-react-pure-export
```

**Note**: This plugin requires ESLint 8.0.0 or higher and `@typescript-eslint/parser`.

## Usage

### ESLint 9+ (Flat Config)

```javascript
// eslint.config.js
import reactPureExport from 'eslint-plugin-react-pure-export';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      'react-pure-export': reactPureExport
    },
    rules: {
      'react-pure-export/no-non-component-export-in-tsx': 'error',
      'react-pure-export/no-tsx-import-in-pure-module': 'error',
      'react-pure-export/no-heavy-deps-in-pure-module': 'error'
    }
  }
];
```

Or use the recommended configuration:

```javascript
// eslint.config.js
import reactPureExport from 'eslint-plugin-react-pure-export';

export default [
  reactPureExport.configs['flat/recommended']
];
```

### ESLint 8 and below (Legacy Config)

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react-pure-export'],
  rules: {
    'react-pure-export/no-non-component-export-in-tsx': 'error',
    'react-pure-export/no-tsx-import-in-pure-module': 'error',
    'react-pure-export/no-heavy-deps-in-pure-module': 'error'
  }
};
```

Or use the recommended configuration:

```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:react-pure-export/recommended']
};
```

## Rules

### ✅ `no-non-component-export-in-tsx`

Disallow non-component runtime exports in `.tsx` files.

**❌ Incorrect:**

```tsx
// Button.tsx
export const PAGE_SIZE = 20; // ❌ Non-component export

export const Button = () => <button>Click</button>;
```

**✅ Correct:**

```tsx
// Button.tsx
export const Button = () => <button>Click</button>; // ✅ Component export
export type ButtonProps = { label: string }; // ✅ Type export
```

[📖 Full documentation](./docs/rules/no-non-component-export-in-tsx.md)

---

### ✅ `no-tsx-import-in-pure-module`

Disallow importing `.tsx` files in pure modules (files matching `*.pure.ts`, `*.utils.ts`, or `*.config.ts`).

**❌ Incorrect:**

```typescript
// helpers.pure.ts
import { Button } from './Button.tsx'; // ❌ Importing .tsx in pure module
```

**✅ Correct:**

```typescript
// helpers.pure.ts
import { formatDate } from './date-utils'; // ✅ Importing .ts file
import { debounce } from 'lodash'; // ✅ Importing npm package
```

[📖 Full documentation](./docs/rules/no-tsx-import-in-pure-module.md)

---

### ✅ `no-heavy-deps-in-pure-module`

Disallow heavy dependencies (React, CSS files) in pure modules.

**❌ Incorrect:**

```typescript
// helpers.pure.ts
import React from 'react'; // ❌ React in pure module
import './styles.css'; // ❌ CSS in pure module
```

**✅ Correct:**

```typescript
// helpers.pure.ts
export const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
```

**Configuration:**

```javascript
{
  'react-pure-export/no-heavy-deps-in-pure-module': ['error', {
    forbiddenDeps: ['react', 'react-dom', 'vue'], // Custom forbidden packages
    forbiddenExtensions: ['.css', '.less', '.scss', '.sass'] // Custom forbidden extensions
  }]
}
```

[📖 Full documentation](./docs/rules/no-heavy-deps-in-pure-module.md)

## What are Pure Modules?

Pure modules are files that contain only business logic, utilities, or configuration without UI dependencies. They are identified by naming patterns:

- `*.pure.ts` - Pure logic modules
- `*.utils.ts` - Utility functions
- `*.config.ts` - Configuration files

**Benefits:**
- Faster loading (no React/CSS overhead)
- Better testability
- Clearer code organization
- Improved tree-shaking

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our development process and how to submit pull requests.

## License

MIT © [eslint-plugin-react-pure-export contributors](https://github.com/Sunny-117/eslint-plugin-react-pure-export/graphs/contributors)

## Related Projects

- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)
