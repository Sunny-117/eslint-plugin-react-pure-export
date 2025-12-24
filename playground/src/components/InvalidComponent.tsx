import React from 'react';

// Valid: React component
export const ValidComponent: React.FC = () => {
  return <div>Valid Component</div>;
};

// INVALID: Non-component const export in .tsx file
// Should trigger: no-non-component-export-in-tsx
export const PAGE_SIZE = 20;

// INVALID: Non-component function export in .tsx file
// Should trigger: no-non-component-export-in-tsx
export function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}

// INVALID: Runtime enum export in .tsx file
// Should trigger: no-non-component-export-in-tsx
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}

// INVALID: Non-component variable export
// Should trigger: no-non-component-export-in-tsx
export const API_URL = 'https://api.example.com';

// Valid: Type exports are allowed
export type ComponentProps = {
  title: string;
};

// Valid: Interface exports are allowed
export interface ComponentState {
  isLoading: boolean;
}
