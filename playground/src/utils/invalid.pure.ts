// INVALID: Pure module importing .tsx file
// Should trigger: no-tsx-import-in-pure-module

// INVALID: Importing from a .tsx file
// Should trigger error: "Pure module should not depend on .tsx files"
import { ValidFC } from '../components/ValidComponent.tsx';
import type { ValidProps } from '../components/ValidComponent.tsx';

// Valid: Importing from .ts file is allowed
import { formatCurrency } from './helpers.pure.ts';

/**
 * This function uses a component from a .tsx file
 * This violates the pure module principle
 */
export function getComponentName(): string {
  // This is invalid - pure modules should not depend on React components
  return ValidFC.name || 'Unknown';
}

/**
 * Helper function that uses imported types
 */
export function createValidProps(title: string): ValidProps {
  return { title };
}

/**
 * Valid utility function
 */
export function calculateDiscount(price: number, percentage: number): number {
  return price * (1 - percentage / 100);
}
