# eslint-plugin-react-pure-export

[![npm version](https://img.shields.io/npm/v/eslint-plugin-react-pure-export.svg)](https://www.npmjs.com/package/eslint-plugin-react-pure-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[中文文档](./README_CN.md)

An ESLint plugin to enforce separation between React components and pure logic modules, improving React Fast Refresh stability and code organization.

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

**Note:** Exports that contain JSX syntax are allowed, even if they're not React components, because JSX requires `.tsx` files.

**Supported React Component Patterns:**

The rule uses intelligent heuristics to recognize React components without relying on hardcoded function names:

1. **Type Annotations**: Components with `React.FC` or `React.FunctionComponent` type annotation
2. **React APIs**: Components wrapped with `React.memo()` or `React.forwardRef()`
3. **HOC Pattern Detection** (Heuristic-based):
   - Functions starting with `with` (e.g., `withAuth`, `withBoundary`, `withRouter`, `withStyles`, etc.)
   - Known wrapper functions (`memo`, `forwardRef`, `observer`, `connect`, `inject`, `compose`)
   - Must have a component-like argument:
     - PascalCase identifier (e.g., `MyComponent`)
     - Arrow function or function expression
     - Another HOC call (for chaining)

**How HOC Detection Works:**

The rule analyzes the code structure to determine if an export is a component:

```tsx
// ✅ Recognized: Function name starts with 'with' + PascalCase argument
export default withAuth(MyComponent);

// ✅ Recognized: Function name starts with 'with' + function argument
export const Protected = withPermissions(() => <div>Protected</div>);

// ✅ Recognized: Known wrapper + component argument
export default compose(MyComponent);

// ✅ Recognized: Chained HOCs
export default withAuth(withRouter(MyComponent));

// ❌ Not recognized: 'with' prefix but non-component argument
export const config = withDefaults(42); // Triggers error

// ❌ Not recognized: camelCase argument (not a component)
export const result = withSomething(myHelper); // Triggers error
```

This approach is more robust than hardcoded name lists because:
- Works with any custom HOC following naming conventions
- Validates that the argument looks like a component
- No need to update the plugin when adding new HOCs

**❌ Incorrect:**

```tsx
// Button.tsx
export const PAGE_SIZE = 20; // ❌ Non-component export without JSX

export function calculateTotal(a, b) { // ❌ Pure function without JSX
  return a + b;
}

export const Button = () => <button>Click</button>;
```

**✅ Correct:**

```tsx
// Button.tsx
export const Button = () => <button>Click</button>; // ✅ Component export

export type ButtonProps = { label: string }; // ✅ Type export

// ✅ React.FC component
export const Home: React.FC = () => <div>Home</div>;

// ✅ React.memo wrapped component
export const MemoizedButton = React.memo(() => <button>Click</button>);

// ✅ React.forwardRef wrapped component
export const ForwardedButton = React.forwardRef((props, ref) => (
  <button ref={ref}>Click</button>
));

// ✅ HOC wrapped component (any 'with*' function)
import { withBoundary } from '@/components/ErrorBoundary';
import { withAuth } from '@/hocs/withAuth';
const MyComponent = () => <div>Hello</div>;
export default withBoundary(MyComponent);
export const Protected = withAuth(MyComponent);

// ✅ Multiple HOCs chained
export default withBoundary(withRouter(MyComponent));

// ✅ Known wrapper functions (compose, inject, etc.)
export default compose(MyComponent);

// ✅ Function with JSX is allowed
export function getEditor() {
  return <div>Editor</div>;
}

// ✅ Config with JSX is allowed
export const tableConfig = {
  columns: [
    {
      title: 'Name',
      render: (text) => <span>{text}</span>
    }
  ]
};

// ✅ Variable with JSX is allowed
export const element = <div>Hello</div>;
```

[📖 Full documentation](./docs/rules/no-non-component-export-in-tsx.md)

---

### ✅ `no-tsx-import-in-pure-module`

Disallow importing `.tsx` files in pure modules.

**Default behavior:** All `.ts` files (including `.pure.ts`, `.utils.ts`, `.config.ts`, etc.) are treated as pure modules.

**Features:**
- ✅ Detects `.tsx` imports even when the file extension is omitted
- ✅ Supports TypeScript path aliases (reads from `tsconfig.json`)

**❌ Incorrect:**

```typescript
// helpers.ts or helpers.pure.ts
import { Button } from './Button.tsx'; // ❌ Explicit .tsx import
import { Button } from './Button'; // ❌ Resolves to Button.tsx
import { Button } from '@/components/Button'; // ❌ Path alias resolves to Button.tsx
```

**✅ Correct:**

```typescript
// helpers.ts
import { formatDate } from './date-utils'; // ✅ Importing .ts file
import { formatDate } from '@/utils/date-utils'; // ✅ Path alias to .ts file
import { debounce } from 'lodash'; // ✅ Importing npm package
```

**Path Alias Support:**

The rule automatically reads `tsconfig.json` to resolve path aliases. You can also specify custom aliases in ESLint configuration.

**Option 1: Automatic (from tsconfig.json)**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

**Option 2: Manual (in ESLint config)**

```javascript
{
  'react-pure-export/no-tsx-import-in-pure-module': ['error', {
    pathAliases: {
      '@': './src',                    // Relative to project root
      '@components': './src/components' // Or use absolute paths
    }
  }]
}
```

The rule will correctly resolve:
- `@/components/Button` → `src/components/Button.tsx` ❌
- `@components/Button` → `src/components/Button.tsx` ❌
- `@/utils/helper` → `src/utils/helper.ts` ✅

**Configuration:**

You can customize which files are treated as pure modules and specify path aliases:

```javascript
{
  'react-pure-export/no-tsx-import-in-pure-module': ['error', {
    pureModulePatterns: ['*.pure.ts', '*.utils.ts'], // Only check these specific patterns
    pathAliases: {                                    // Optional: custom path aliases
      '@': './src',
      '@components': './src/components'
    }
  }]
}
```

[📖 Full documentation](./docs/rules/no-tsx-import-in-pure-module.md)

---

### ✅ `no-heavy-deps-in-pure-module`

Disallow heavy dependencies (React, CSS files) in pure modules.

**❌ Incorrect:**

```typescript
// helpers.ts
import React from 'react'; // ❌ React in pure module
import './styles.css'; // ❌ CSS in pure module
```

**✅ Correct:**

```typescript
// helpers.ts
export const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
```

**Configuration:**

```javascript
{
  'react-pure-export/no-heavy-deps-in-pure-module': ['error', {
    pureModulePatterns: ['*.pure.ts', '*.utils.ts'], // Only check these specific patterns
    forbiddenDeps: ['react', 'react-dom', 'vue'], // Custom forbidden packages
    forbiddenExtensions: ['.css', '.less', '.scss', '.sass'] // Custom forbidden extensions
  }]
}
```

[📖 Full documentation](./docs/rules/no-heavy-deps-in-pure-module.md)

## What are Pure Modules?

Pure modules are files that contain only business logic, utilities, or configuration without UI dependencies.

**Default behavior:** By default, all `.ts` files (including `.pure.ts`, `.utils.ts`, `.config.ts`, etc.) are treated as pure modules.

**Custom patterns:** You can configure which files are treated as pure modules using the `pureModulePatterns` option:

```javascript
{
  'react-pure-export/no-tsx-import-in-pure-module': ['error', {
    pureModulePatterns: ['*.pure.ts', '*.utils.ts'] // Only check these specific patterns
  }]
}
```

Common patterns:
- `*.ts` - All TypeScript files ending with .ts (default, matches helpers.ts, helpers.pure.ts, etc.)
- `*.pure.ts` - Only pure logic modules
- `*.utils.ts` - Only utility functions
- `*.config.ts` - Only configuration files

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
