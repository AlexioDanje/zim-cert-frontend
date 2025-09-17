import axios from 'axios';
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

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Certificate API
export const certificateApi = {
  list: async (organizationId: string): Promise<Certificate[]> => {
    const response = await api.get('/certificates', {
      params: { organizationId }
    });
    return response.data.items || response.data;
  },

  search: async (filters: SearchFilters): Promise<{ items: Certificate[]; total: number; hasMore?: boolean }> => {
    const response = await api.post('/certificates/search', filters);
    const data = response.data || {};
    return {
      items: data.certificates || data.items || [],
      total: typeof data.total === 'number' ? data.total : (data.items?.length || data.certificates?.length || 0),
      hasMore: data.hasMore,
    };
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
    const response = await api.post('/certificates', data);
    return response.data;
  },

  bulkIssue: async (data: BulkIssueForm): Promise<BulkIssueResult> => {
    const response = await api.post('/certificates/bulk-issue', data);
    return response.data;
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
  list: async (): Promise<Program[]> => {
    const response = await api.get('/programs');
    return response.data.items || response.data;
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
    return response.data.items || response.data;
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

  verifyByNationalId: async (nationalId: string, organizationId: string = 'org-demo'): Promise<VerificationResult> => {
    const response = await api.post('/verify/national-id', { nationalId, organizationId });
    return response.data;
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

export default api;
