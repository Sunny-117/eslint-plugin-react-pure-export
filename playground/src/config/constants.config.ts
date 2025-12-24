// Valid pure module - configuration constants

/**
 * Application configuration constants
 */
export const APP_CONFIG = {
  name: 'ESLint Plugin Demo',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  retryAttempts: 3,
} as const;

/**
 * Pagination constants
 */
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
  minPageSize: 5,
} as const;

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  minPasswordLength: 8,
  maxPasswordLength: 128,
  minUsernameLength: 3,
  maxUsernameLength: 50,
} as const;

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  enableDarkMode: true,
  enableNotifications: true,
  enableAnalytics: false,
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
  dashboard: '/dashboard',
  profile: '/profile',
} as const;

// Type exports are allowed
export type AppConfig = typeof APP_CONFIG;
export type ApiConfig = typeof API_CONFIG;
export type Routes = typeof ROUTES;

// Enums are allowed in config files (const enum)
export const enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

// Interface exports are allowed
export interface ConfigOptions {
  apiUrl?: string;
  timeout?: number;
  debug?: boolean;
}
