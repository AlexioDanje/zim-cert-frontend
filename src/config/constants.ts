// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Application Configuration
export const APP_CONFIG = {
  NAME: 'ZIM Certificate Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Secure, transparent, and blockchain-inspired digital certificate management',
  SUPPORT_EMAIL: 'support@zimcert.com',
  DOCS_URL: 'https://docs.zimcert.com',
} as const;

// Pagination Configuration
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['text/csv', 'application/vnd.ms-excel'],
  ALLOWED_EXTENSIONS: ['.csv', '.xlsx'],
} as const;

// Certificate Configuration
export const CERTIFICATE_CONFIG = {
  DEFAULT_VALIDITY_YEARS: 5,
  MAX_VALIDITY_YEARS: 10,
  MIN_VALIDITY_DAYS: 30,
} as const;

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 5000,
  MODAL_ANIMATION_DURATION: 150,
} as const;

// Feature Flags
export const FEATURES = {
  BULK_OPERATIONS: true,
  ADVANCED_REPORTS: true,
  TEMPLATE_EDITOR: true,
  API_INTEGRATION: true,
  DARK_MODE: true,
  EXPORT_FUNCTIONALITY: true,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CERTIFICATE_ISSUED: 'Certificate issued successfully',
  CERTIFICATE_REVOKED: 'Certificate revoked successfully',
  BULK_OPERATION_COMPLETED: 'Bulk operation completed successfully',
  DATA_EXPORTED: 'Data exported successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;
