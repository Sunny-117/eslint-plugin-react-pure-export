# no-non-component-export-in-tsx

Disallow non-component runtime exports in `.tsx` files.

## Rule Details

This rule enforces that `.tsx` files should only export React components and type definitions. Non-component runtime exports (constants, functions, enums) should be extracted to separate `.ts` files.

**Why?** Non-component exports in `.tsx` files can break React Fast Refresh. When you modify a component, the entire module reloads, causing state loss and degraded developer experience.

## Examples

### ❌ Incorrect

```tsx
// Button.tsx
export const PAGE_SIZE = 20; // ❌ Non-component constant export

export const Button = () => <button>Click</button>;
```

```tsx
// UserProfile.tsx
export function validateEmail(email: string) { // ❌ Non-component function export
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const UserProfile = () => <div>Profile</div>;
```

```tsx
// Dashboard.tsx
export enum Status { // ❌ Runtime enum export
  Active = 'active',
  Inactive = 'inactive'
}

export const Dashboard = () => <div>Dashboard</div>;
```

```tsx
// App.tsx
export let counter = 0; // ❌ Variable export

export const App = () => <div>App</div>;
```

### ✅ Correct

```tsx
// Button.tsx
export const Button = () => <button>Click</button>; // ✅ Component export
```

```tsx
// UserProfile.tsx
export const UserProfile: React.FC = () => <div>Profile</div>; // ✅ React.FC component
```

```tsx
// Dashboard.tsx
export const Dashboard = React.memo(() => <div>Dashboard</div>); // ✅ React.memo component
```

```tsx
// Input.tsx
export const Input = React.forwardRef<HTMLInputElement>((props, ref) => {
  return <input ref={ref} {...props} />;
}); // ✅ React.forwardRef component
```

```tsx
// Button.tsx
export type ButtonProps = { // ✅ Type export
  label: string;
  onClick: () => void;
};

export interface ButtonState { // ✅ Interface export
  isPressed: boolean;
}

export const Button = () => <button>Click</button>;
```

```tsx
// Status.tsx
export const enum Status { // ✅ Const enum (type-only)
  Active = 'active',
  Inactive = 'inactive'
}

export declare enum Color { // ✅ Declare enum (type-only)
  Red,
  Blue
}

export const StatusBadge = () => <div>Badge</div>;
```

## What is Considered a React Component?

The rule recognizes the following as React components:

1. **React.FC type annotation**
   ```tsx
   export const Component: React.FC = () => <div />;
   export const Component: FC<Props> = () => <div />;
   ```

2. **React.memo wrapper**
   ```tsx
   export const Component = React.memo(() => <div />);
   export const Component = memo(() => <div />);
   ```

3. **React.forwardRef wrapper**
   ```tsx
   export const Component = React.forwardRef(() => <div />);
   export const Component = forwardRef(() => <div />);
   ```

4. **Function returning JSX**
   ```tsx
   export function Component() {
     return <div />;
   }
   ```

## What is Allowed?

The rule allows the following exports in `.tsx` files:

- ✅ React components (as defined above)
- ✅ Type definitions (`type`, `interface`)
- ✅ Type-only enums (`const enum`, `declare enum`)
- ✅ Type-only exports (`export type { ... }`)

## What is Not Allowed?

The rule disallows the following exports in `.tsx` files:

- ❌ Constants (`const`, `let`, `var`)
- ❌ Non-component functions
- ❌ Runtime enums (regular `enum`)
- ❌ Classes (unless they are React components)
- ❌ Objects

## Auto-fix

This rule provides auto-fix suggestions that generate:

1. A TODO comment indicating where to create the new file
2. The code that should be extracted
3. An import statement to use in the original file

**Example:**

Before fix:
```tsx
// Button.tsx
export const PAGE_SIZE = 20;
export const Button = () => <button>Click</button>;
```

After applying fix:
```tsx
// Button.tsx
// TODO: Create page-size.ts with:
// export const PAGE_SIZE = 20;
import { PAGE_SIZE } from './page-size';

export const Button = () => <button>Click</button>;
```

You'll need to manually create the `page-size.ts` file with the extracted code.

## When Not To Use It

You might want to disable this rule if:

- You're not using React Fast Refresh
- You're working on a non-React TypeScript project
- You have a different convention for organizing component files

## Further Reading

- [React Fast Refresh](https://github.com/facebook/react/tree/main/packages/react-refresh)
- [Why Fast Refresh Doesn't Work](https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/docs/TROUBLESHOOTING.md#edits-always-lead-to-full-reload)
- [React Component Patterns](https://react.dev/learn/your-first-component)

## Related Rules

- [no-tsx-import-in-pure-module](./no-tsx-import-in-pure-module.md)
- [no-heavy-deps-in-pure-module](./no-heavy-deps-in-pure-module.md)
