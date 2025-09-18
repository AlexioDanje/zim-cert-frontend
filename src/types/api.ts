/**
 * Professional API type definitions with comprehensive error handling
 * Provides type safety for all API interactions
 */

// Base API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
  message?: string;
}

// API Error interface
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  requestId?: string;
  timestamp?: string;
}

// API Metadata interface
export interface ApiMeta {
  total?: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
  searchQuery?: string;
  appliedFilters?: string[];
  requestId?: string;
  duration?: string;
  [key: string]: any;
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// Sorting interface
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAtIso: string;
  updatedAtIso?: string;
}

// Audit trail interface
export interface AuditTrail {
  createdBy?: string;
  updatedBy?: string;
  version?: number;
  changeLog?: ChangeLogEntry[];
}

export interface ChangeLogEntry {
  timestamp: string;
  userId: string;
  action: 'created' | 'updated' | 'deleted' | 'restored';
  changes: Record<string, { from: any; to: any }>;
  reason?: string;
}

// Search and filter interfaces
export interface SearchFilters extends PaginationParams, SortParams {
  query?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  organizationId?: string;
  [key: string]: any;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  facets?: SearchFacet[];
}

export interface SearchFacet {
  field: string;
  values: Array<{
    value: string;
    count: number;
    selected?: boolean;
  }>;
}

// Request/Response tracking
export interface RequestContext {
  requestId: string;
  timestamp: string;
  userId?: string;
  organizationId?: string;
  userAgent?: string;
  ip?: string;
}

// File upload interfaces
export interface FileUpload {
  file: File;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
}

// Batch operation interfaces
export interface BatchOperation<T> {
  items: T[];
  operation: 'create' | 'update' | 'delete';
  options?: {
    skipValidation?: boolean;
    continueOnError?: boolean;
  };
}

export interface BatchResult<T> {
  successful: T[];
  failed: Array<{
    item: T;
    error: string;
    index: number;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// Validation interfaces
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationError[];
}

// Export/Import interfaces
export interface ExportRequest {
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  filters?: SearchFilters;
  fields?: string[];
  options?: {
    includeHeaders?: boolean;
    dateFormat?: string;
    timezone?: string;
  };
}

export interface ExportResponse {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  progress?: number;
  error?: string;
  createdAt: string;
  expiresAt: string;
}

// Cache interfaces
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  etag?: string;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
  tags?: string[];
}

// WebSocket/Real-time interfaces
export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: string;
  requestId?: string;
}

export interface SubscriptionOptions {
  topics: string[];
  userId?: string;
  organizationId?: string;
  filters?: Record<string, any>;
}

// Health check and monitoring
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: Record<string, {
    status: 'up' | 'down' | 'degraded';
    responseTime?: number;
    error?: string;
  }>;
  version: string;
  uptime: number;
}

// Feature flags
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number;
  conditions?: Array<{
    property: string;
    operator: 'equals' | 'contains' | 'in' | 'gt' | 'lt';
    value: any;
  }>;
}

// Analytics and metrics
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: string;
}

export interface Metrics {
  name: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
  timestamp: string;
}

// Type guards for runtime type checking
export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return obj && typeof obj === 'object' && 'success' in obj;
}

export function isApiError(obj: any): obj is ApiError {
  return obj && typeof obj === 'object' && 'code' in obj && 'message' in obj;
}

export function isValidationResult(obj: any): obj is ValidationResult {
  return obj && typeof obj === 'object' && 'valid' in obj && 'errors' in obj;
}

// Utility types for API operations
export type CreateRequest<T> = Omit<T, 'id' | 'createdAtIso' | 'updatedAtIso'>;
export type UpdateRequest<T> = Partial<Omit<T, 'id' | 'createdAtIso'>> & { id: string };
export type PatchRequest<T> = Partial<Omit<T, 'id'>> & { id: string };

// Generic API client interface
export interface ApiClient {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data?: any, config?: any): Promise<T>;
  put<T>(url: string, data?: any, config?: any): Promise<T>;
  patch<T>(url: string, data?: any, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
  upload<T>(url: string, file: File, config?: any): Promise<T>;
  download(url: string, config?: any): Promise<Blob>;
}

// Rate limiting interfaces
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export interface RateLimitError extends ApiError {
  rateLimitInfo: RateLimitInfo;
}
