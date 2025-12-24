# no-heavy-deps-in-pure-module

Disallow heavy dependencies (React, CSS files) in pure modules.

## Rule Details

This rule prevents pure logic modules from importing heavy dependencies like React, React DOM, or style files. This keeps pure modules lightweight and focused on business logic.

**Why?** Heavy dependencies in pure modules:
- Increase bundle size unnecessarily
- Slow down module loading
- Make testing more complex
- Violate separation of concerns
- Reduce code reusability

## What is a Pure Module?

Pure modules are files that contain only business logic, utilities, or configuration without UI dependencies. They are identified by these naming patterns:

- `*.pure.ts` - Pure logic modules
- `*.utils.ts` - Utility functions
- `*.config.ts` - Configuration files

## Examples

### ❌ Incorrect

```typescript
// helpers.pure.ts
import React from 'react'; // ❌ React in pure module

export function createComponent() {
  return React.createElement('div');
}
```

```typescript
// validation.utils.ts
import ReactDOM from 'react-dom'; // ❌ React DOM in pure module

export function renderToString(element: any) {
  return ReactDOM.renderToString(element);
}
```

```typescript
// constants.config.ts
import './styles.css'; // ❌ CSS in pure module

export const THEME = {
  primary: '#007bff'
};
```

```typescript
// format.pure.ts
import './format.less'; // ❌ LESS in pure module

export function formatText(text: string) {
  return text.toUpperCase();
}
```

```typescript
// api.utils.ts
import styles from './api.scss'; // ❌ SCSS in pure module

export function fetchData() {
  // ...
}
```

### ✅ Correct

```typescript
// helpers.pure.ts
export function formatDate(date: Date): string { // ✅ Pure logic
  return date.toISOString().split('T')[0];
}
```

```typescript
// validation.utils.ts
export function validateEmail(email: string): boolean { // ✅ Pure validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

```typescript
// constants.config.ts
export const API_CONFIG = { // ✅ Pure configuration
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
};
```

```typescript
// math.pure.ts
import { debounce } from 'lodash'; // ✅ Utility library

export const debouncedCalculate = debounce((x: number, y: number) => {
  return x + y;
}, 300);
```

```typescript
// storage.utils.ts
export function saveToLocalStorage(key: string, value: any): void { // ✅ Pure utility
  localStorage.setItem(key, JSON.stringify(value));
}
```

## Default Configuration

By default, the rule forbids:

**Forbidden Dependencies:**
- `react`
- `react-dom`

**Forbidden Extensions:**
- `.css`
- `.less`
- `.scss`

## Configuration Options

You can customize which dependencies and file extensions are forbidden:

```javascript
{
  'react-pure-export/no-heavy-deps-in-pure-module': ['error', {
    forbiddenDeps: ['react', 'react-dom', 'vue', '@emotion/react'],
    forbiddenExtensions: ['.css', '.less', '.scss', '.sass', '.styl']
  }]
}
```

### Options

#### `forbiddenDeps`

Type: `string[]`  
Default: `['react', 'react-dom']`

An array of package names that should not be imported in pure modules.

**Example:**

```javascript
{
  'react-pure-export/no-heavy-deps-in-pure-module': ['error', {
    forbiddenDeps: ['react', 'react-dom', 'vue', 'angular']
  }]
}
```

#### `forbiddenExtensions`

Type: `string[]`  
Default: `['.css', '.less', '.scss']`

An array of file extensions that should not be imported in pure modules.

**Example:**

```javascript
{
  'react-pure-export/no-heavy-deps-in-pure-module': ['error', {
    forbiddenExtensions: ['.css', '.less', '.scss', '.sass', '.styl', '.pcss']
  }]
}
```

### Empty Configuration

If you provide an empty configuration, the rule will use the default values:

```javascript
{
  'react-pure-export/no-heavy-deps-in-pure-module': ['error', {}]
}
```

This is equivalent to:

```javascript
{
  'react-pure-export/no-heavy-deps-in-pure-module': ['error', {
    forbiddenDeps: ['react', 'react-dom'],
    forbiddenExtensions: ['.css', '.less', '.scss']
  }]
}
```

## How to Fix

### Option 1: Move Logic to Component Files

If you need React in your logic, move it to a component file:

**Before:**
```typescript
// helpers.pure.ts
import React from 'react'; // ❌

export function createDiv() {
  return React.createElement('div');
}
```

**After:**
```typescript
// helpers.tsx (renamed to .tsx)
import React from 'react'; // ✅

export function createDiv() {
  return React.createElement('div');
}
```

### Option 2: Extract Pure Logic

Extract the pure logic parts to keep the module lightweight:

**Before:**
```typescript
// validation.pure.ts
import React from 'react'; // ❌

export function validateAndRender(email: string) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return React.createElement('div', null, isValid ? 'Valid' : 'Invalid');
}
```

**After:**
```typescript
// validation.pure.ts
export function validateEmail(email: string): boolean { // ✅ Pure logic
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

```tsx
// ValidationDisplay.tsx
import React from 'react'; // ✅
import { validateEmail } from './validation.pure';

export const ValidationDisplay = ({ email }: { email: string }) => {
  const isValid = validateEmail(email);
  return <div>{isValid ? 'Valid' : 'Invalid'}</div>;
};
```

### Option 3: Remove Style Imports

Style imports should be in component files, not pure modules:

**Before:**
```typescript
// constants.config.ts
import './theme.css'; // ❌

export const COLORS = {
  primary: '#007bff'
};
```

**After:**
```typescript
// constants.config.ts
export const COLORS = { // ✅
  primary: '#007bff'
};
```

```tsx
// App.tsx
import './theme.css'; // ✅ Import styles in component
import { COLORS } from './constants.config';

export const App = () => {
  return <div style={{ color: COLORS.primary }}>App</div>;
};
```

## Benefits

1. **Smaller Bundle Size**: Pure modules don't include React or CSS overhead
2. **Faster Loading**: Lightweight modules load faster
3. **Better Testing**: No need to mock React or handle CSS imports in tests
4. **Framework Agnostic**: Pure logic can be reused in different frameworks
5. **Clearer Separation**: Enforces clean architecture principles

## Use Cases

### ✅ Good Use Cases for Pure Modules

- Data validation functions
- Date/time formatting utilities
- Mathematical calculations
- API request builders
- Data transformations
- Business logic rules
- Configuration constants
- Type definitions

### ❌ Bad Use Cases for Pure Modules

- Component rendering logic
- Style definitions
- React hooks
- DOM manipulation
- UI state management

## When Not To Use It

You might want to disable this rule if:

- You're not following the pure module naming convention
- You have a different definition of "pure" modules
- You're working on a small project where bundle size isn't a concern
- You need to gradually migrate an existing codebase

However, we recommend keeping this rule enabled for better code organization and performance.

## Performance Impact

Keeping pure modules lightweight has measurable performance benefits:

- **Initial Load**: Faster because pure modules don't load React/CSS
- **Code Splitting**: Better tree-shaking and smaller chunks
- **Testing**: Faster test execution without React overhead
- **Build Time**: Faster builds with fewer dependencies to process

## Further Reading

- [Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [Code Splitting](https://reactjs.org/docs/code-splitting.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)

## Related Rules

- [no-non-component-export-in-tsx](./no-non-component-export-in-tsx.md)
- [no-tsx-import-in-pure-module](./no-tsx-import-in-pure-module.md)
