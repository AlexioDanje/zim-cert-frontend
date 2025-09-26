import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  Certificate, 
  CertificateTemplate, 
  Program, 
  Student, 
  VerificationResult, 
  BulkIssueResult, 
  BulkRevokeResult, 
  SearchResult, 
  SearchFilters, 
  IssueCertificateForm, 
  BulkIssueForm, 
  CertificateStatistics 
} from '../types';
import { handleApiError, ApiError } from '../utils/apiErrorHandler';

// Enhanced API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: Record<string, any>;
  message?: string;
}

// Request configuration with retry logic
interface ApiRequestConfig extends AxiosRequestConfig {
  retries?: number;
  retryDelay?: number;
  metadata?: {
    startTime?: number;
    [key: string]: any;
  };
}

// Create axios instance with professional configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor with enhanced logging and auth
api.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = localStorage.getItem('zimcert_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['x-request-id'] = generateRequestId();

    // Add timestamp for performance monitoring
    config.metadata = { startTime: Date.now() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with error handling and retry logic
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const duration = Date.now() - (response.config.metadata?.startTime || 0);

    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data,
        duration: `${duration}ms`,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as ApiRequestConfig;
    
    // Calculate request duration if available
    const duration = config?.metadata?.startTime ? Date.now() - config.metadata.startTime : 0;

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.response?.status || 'Network'} ${config?.method?.toUpperCase()} ${config?.url} (${duration}ms)`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        duration: `${duration}ms`,
      });
    }

    // Retry logic for retryable errors
    if (shouldRetry(error) && config && (config.retries || 0) < 3) {
      config.retries = (config.retries || 0) + 1;
      const delay = config.retryDelay || Math.pow(2, config.retries) * 1000; // Exponential backoff

      console.log(`🔄 Retrying request (attempt ${config.retries}/3) after ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(config);
    }

    return Promise.reject(error);
  }
);

// Helper functions
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function shouldRetry(error: AxiosError): boolean {
  if (!error.response) return true; // Network errors
  
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return retryableStatuses.includes(error.response.status);
}

// Resolve organization id (placeholder; replace with actual org selection if available)
async function getOrganizationId(): Promise<string | undefined> {
  // Try to read from localStorage/session or return default
  try {
    const org = localStorage.getItem('zimcert_org_id');
    return org || 'org-university';
  } catch {
    return 'org-university';
  }
}

// Enhanced API wrapper with error handling
async function apiCall<T>(
  requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> {
  try {
    const response = await requestFn();
    
    // Handle new API response format
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      const apiResponse = response.data as ApiResponse<T>;
      
      if (apiResponse.success && apiResponse.data !== undefined) {
        // Handle nested data structure (e.g., { data: { items: [...] } })
        if (typeof apiResponse.data === 'object' && 'items' in apiResponse.data) {
          return (apiResponse.data as any).items;
        }
        return apiResponse.data;
      } else if (!apiResponse.success && apiResponse.error) {
        throw new Error(apiResponse.error.message || 'API request failed');
      }
    }
    
    // Fallback for legacy API responses
    return response.data as T;
  } catch (error) {
    // If it's already a processed error from our API response, just re-throw it
    if (error instanceof Error && error.message !== 'API request failed') {
      throw error;
    }
    
    // Otherwise, handle it as an Axios error
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

// Helper function to handle direct API calls with proper error processing
async function handleDirectApiCall<T>(requestFn: () => Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

// Certificate API
export const certificateApi = {
  list: async (organizationId: string): Promise<Certificate[]> => {
    return await apiCall(() => api.get('/certificates', {
      params: { organizationId }
    }));
  },

  search: async (filters: SearchFilters): Promise<{ items: Certificate[]; total: number; hasMore?: boolean }> => {
    return await handleDirectApiCall(async () => {
      const response = await api.post('/certificates/search', filters);
      const data = response.data || {};
      
      // Handle new API response format with nested data
      const actualData = data.data || data;
      
      return {
        ...response,
        data: {
          items: actualData.certificates || actualData.items || [],
          total: typeof actualData.total === 'number' ? actualData.total : (actualData.items?.length || actualData.certificates?.length || 0),
          hasMore: actualData.hasMore,
        }
      };
    });
  },

  getById: async (id: string): Promise<Certificate> => {
    const response = await api.get(`/certificates/${id}`);
    return response.data;
  },

  getWithAmendments: async (id: string): Promise<Certificate> => {
    const response = await api.get(`/certificates/${id}/with-amendments`);
    return response.data;
  },

  statistics: async (organizationId: string): Promise<CertificateStatistics> => {
    const response = await api.get('/certificates/statistics', {
      params: { organizationId }
    });
    return response.data;
  },

  issue: async (data: IssueCertificateForm): Promise<Certificate> => {
    const hasNationalIdOnly = data.nationalId;
  
    if (hasNationalIdOnly) {
      return await apiCall(async () => {
        const response = await api.post('/certificates/issue-by-national-id', data);
        return response.data?.data || response.data;
      });
    } else {
      return await apiCall(async () => {
        const response = await api.post('/certificates', data);
        return response.data;
      });
    }
  },

  bulkIssue: async (data: BulkIssueForm): Promise<BulkIssueResult> => {
    return await apiCall(async () => {
      const response = await api.post('/certificates/bulk-issue', data);
      return response.data;
    });
  },

  reissue: async (data: {
    certificateId: string;
    reason: string;
    newData: Record<string, any>;
  }): Promise<Certificate> => {
    const response = await api.post('/certificates/reissue', data);
    return response.data;
  },

  addAmendment: async (id: string, data: {
    amendmentType: 'correction' | 'update' | 'reissue';
    reason: string;
    newData: Record<string, any>;
  }): Promise<Certificate> => {
    const response = await api.post(`/certificates/${id}/amendments`, data);
    return response.data;
  },

  revoke: async (id: string, reason?: string): Promise<{ id: string; status: string }> => {
    const response = await api.post(`/certificates/${id}/revoke`, { reason });
    return response.data;
  },

  bulkRevoke: async (certificateIds: string[], reason?: string): Promise<BulkRevokeResult> => {
    const response = await api.post('/certificates/bulk-revoke', { 
      certificateIds, 
      reason 
    });
    return response.data;
  },

  updateStatus: async (id: string, status: 'issued' | 'revoked' | 'pending', reason?: string): Promise<Certificate> => {
    const response = await api.put(`/certificates/${id}/status`, { status, reason });
    return response.data;
  },

  getStatistics: async (organizationId: string): Promise<CertificateStatistics> => {
    const response = await api.get('/certificates/statistics', {
      params: { organizationId }
    });
    return response.data;
  },
};

// Template API
export const templateApi = {
  list: async (): Promise<CertificateTemplate[]> => {
    const response = await api.get('/templates');
    return response.data.items || response.data;
  },

  create: async (data: Omit<CertificateTemplate, 'id' | 'createdAtIso'>): Promise<CertificateTemplate> => {
    const response = await api.post('/templates', data);
    return response.data;
  },

  update: async (data: CertificateTemplate): Promise<CertificateTemplate> => {
    const response = await api.put('/templates', data);
    return response.data;
  },
};

// Program API
export const programApi = {
  list: async (organizationId?: string): Promise<Program[]> => {
    const params = organizationId ? { organizationId } : {};
    const response = await api.get('/programs', { params });
    // Handle nested response structure
    const responseData = response.data.data || response.data;
    return responseData.programs || responseData.items || responseData;
  },

  create: async (data: Omit<Program, 'id'>): Promise<Program> => {
    const response = await api.post('/programs', data);
    return response.data;
  },

  update: async (data: Program): Promise<Program> => {
    const response = await api.put('/programs', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/programs/${id}`);
  },
};

// Student API
export const studentApi = {
  list: async (): Promise<Student[]> => {
    const response = await api.get('/students');
    // Handle nested response structure
    const responseData = response.data.data || response.data;
    return responseData.students || responseData.items || responseData;
  },

  importCsv: async (data: { csvData: string; fieldMapping: Record<string, string> }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/students/import-csv', data);
    return response.data;
  },
};

// Verification API
export const verifyApi = {
  verifyByPublicId: async (publicId: string): Promise<VerificationResult> => {
    const response = await api.get(`/verify/${publicId}`);
    return response.data;
  },

  verifyByNationalId: async (nationalId: string, organizationId?: string): Promise<VerificationResult> => {
    // Search for certificates with this national ID across all organizations
    const searchParams: any = {
      query: nationalId,
      limit: 50 // Get all matching certificates
    };
    
    // Only include organizationId if specifically provided (for filtered searches)
    if (organizationId) {
      searchParams.organizationId = organizationId;
    }
    
    const searchResponse = await api.post('/certificates/search', searchParams);
    
    // Handle nested response structure - the response has { success: true, data: { certificates: [...] } }
    const responseData = searchResponse.data.data || searchResponse.data;
    const certificates = responseData.certificates || responseData.items || [];
    
    if (certificates.length > 0) {
      // Return all certificates, but mark as valid if any are issued
      const hasIssuedCertificate = certificates.some(cert => cert.status === 'issued');
      return {
        valid: hasIssuedCertificate,
        certificate: certificates[0], // Primary certificate for compatibility
        certificates: certificates // All matching certificates
      };
    } else {
      // No certificate found for this national ID
      return {
        valid: false,
        certificate: null,
        certificates: []
      };
    }
  },
};

// Bulk Operations API
export const bulkApi = {
  importCsv: async (data: BulkIssueForm): Promise<BulkIssueResult> => {
    const response = await api.post('/bulk/import-csv', data);
    return response.data;
  },

  downloadTemplate: async (): Promise<Blob> => {
    const response = await api.get('/bulk/template', {
      responseType: 'blob'
    });
    return response.data;
  },
};

// Institution API
export const institutionApi = {
  list: async (): Promise<any[]> => {
    const response = await api.get('/institutions');
    // Handle nested response structure
    const responseData = response.data.data || response.data;
    return responseData.institutions || responseData.items || responseData;
  },
};

// Reports API
export const reportsApi = {
  generate: async (organizationId: string, type: 'summary' | 'detailed' = 'summary'): Promise<any> => {
    const response = await api.get('/reports/generate', {
      params: { organizationId, type }
    });
    return response.data;
  },

  export: async (organizationId: string, format: 'json' | 'csv' = 'json'): Promise<Blob> => {
    const response = await api.get('/reports/export', {
      params: { organizationId, format },
      responseType: 'blob'
    });
    return response.data;
  },
};

export { api };
export default api;
