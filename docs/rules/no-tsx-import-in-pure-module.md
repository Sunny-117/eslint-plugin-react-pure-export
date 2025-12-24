# no-tsx-import-in-pure-module

Disallow importing `.tsx` files in pure modules.

## Rule Details

This rule prevents pure logic modules from importing `.tsx` files, maintaining clear boundaries between UI components and business logic.

**Why?** Importing `.tsx` files in pure modules creates tight coupling between UI and logic, leading to:
- Circular dependencies
- Difficult testing (need to mock React components)
- Poor code reusability
- Unclear module responsibilities

## What is a Pure Module?

Pure modules are files that contain only business logic, utilities, or configuration without UI dependencies. They are identified by these naming patterns:

- `*.pure.ts` - Pure logic modules
- `*.utils.ts` - Utility functions
- `*.config.ts` - Configuration files

## Examples

### ❌ Incorrect

```typescript
// helpers.pure.ts
import { Button } from './Button.tsx'; // ❌ Importing .tsx in pure module

export function createButtonConfig() {
  return { component: Button };
}
```

```typescript
// validation.utils.ts
import { UserProfile } from '../components/UserProfile.tsx'; // ❌ Importing .tsx

export function validateUser(profile: typeof UserProfile) {
  // ...
}
```

```typescript
// constants.config.ts
import { THEME } from './Theme.tsx'; // ❌ Importing .tsx

export const APP_CONFIG = {
  theme: THEME
};
```

### ✅ Correct

```typescript
// helpers.pure.ts
import { formatDate } from './date-utils'; // ✅ Importing .ts file
import { debounce } from 'lodash'; // ✅ Importing npm package

export function processData(data: string) {
  return formatDate(data);
}
```

```typescript
// validation.utils.ts
import type { UserProfile } from '../types/user'; // ✅ Type-only import

export function validateUser(profile: UserProfile) {
  return profile.email.includes('@');
}
```

```typescript
// constants.config.ts
export const APP_CONFIG = { // ✅ No imports from .tsx
  apiUrl: 'https://api.example.com',
  timeout: 5000
};
```

```typescript
// api.pure.ts
import { User } from './types'; // ✅ Importing types from .ts

export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

## Allowed Imports in Pure Modules

Pure modules can import:

- ✅ Other `.ts` files
- ✅ `.js` files
- ✅ npm packages
- ✅ Type-only imports from `.tsx` files (`import type { ... }`)
- ✅ JSON files
- ✅ Any non-`.tsx` files

## Disallowed Imports in Pure Modules

Pure modules cannot import:

- ❌ `.tsx` files (value imports)

## How to Fix

### Option 1: Extract Types

If you only need types from a `.tsx` file, use type-only imports:

**Before:**
```typescript
// helpers.pure.ts
import { Button } from './Button.tsx'; // ❌

export function createConfig(button: typeof Button) {
  // ...
}
```

**After:**
```typescript
// Button.tsx
export type ButtonType = {
  label: string;
  onClick: () => void;
};

export const Button: React.FC<ButtonType> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
```

```typescript
// helpers.pure.ts
import type { ButtonType } from './Button.tsx'; // ✅ Type-only import

export function createConfig(button: ButtonType) {
  // ...
}
```

### Option 2: Extract Shared Logic

If you need shared logic, extract it to a separate `.ts` file:

**Before:**
```typescript
// helpers.pure.ts
import { validateEmail } from './UserForm.tsx'; // ❌
```

**After:**
```typescript
// validation.ts
export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

```typescript
// UserForm.tsx
import { validateEmail } from './validation'; // ✅

export const UserForm = () => {
  // Use validateEmail
};
```

```typescript
// helpers.pure.ts
import { validateEmail } from './validation'; // ✅
```

### Option 3: Invert the Dependency

Instead of pure modules importing components, have components import from pure modules:

**Before:**
```typescript
// config.pure.ts
import { Button } from './Button.tsx'; // ❌

export const COMPONENTS = {
  button: Button
};
```

**After:**
```typescript
// config.pure.ts
export const BUTTON_CONFIG = { // ✅
  size: 'medium',
  variant: 'primary'
};
```

```typescript
// Button.tsx
import { BUTTON_CONFIG } from './config.pure'; // ✅

export const Button = () => {
  const { size, variant } = BUTTON_CONFIG;
  // ...
};
```

## Benefits of Pure Modules

1. **Better Testability**: Pure modules can be tested without mocking React components
2. **Faster Loading**: No React/JSX overhead
3. **Better Reusability**: Logic can be shared across different UI frameworks
4. **Clearer Architecture**: Enforces separation of concerns
5. **Improved Tree-shaking**: Smaller bundle sizes

## When Not To Use It

You might want to disable this rule if:

- You're not following the pure module naming convention
- You have a different architecture pattern
- You're working on a small project where separation isn't critical

However, we recommend keeping this rule enabled for better code organization.

## Configuration

This rule has no configuration options. It automatically detects pure modules based on file naming patterns.

## Further Reading

- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## Related Rules

- [no-non-component-export-in-tsx](./no-non-component-export-in-tsx.md)
- [no-heavy-deps-in-pure-module](./no-heavy-deps-in-pure-module.md)
