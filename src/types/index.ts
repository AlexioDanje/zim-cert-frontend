// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Certificate Types
export interface Certificate {
  id: string;
  publicId: string;
  studentId: string;
  programId: string;
  templateId: string;
  organizationId: string;
  grade?: string;
  issueDate: string;
  expiryDate?: string;
  status: 'issued' | 'revoked' | 'pending' | 'expired';
  additionalFields: Record<string, any>;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  updatedAtIso: string;
  signature: string;
  publicUrlId: string;
  payload: {
    organizationId: string;
    studentReference: string;
    templateId: string;
    programId: string;
    fields: Record<string, any>;
  };
  createdAtIso: string;
}

export type AwardClassification = 'Distinction' | 'Merit' | 'Pass' | 'Honors' | 'None';
export type DegreeClassShort = '1' | '2.1' | '2.2' | '3' | 'F';
export type DegreeClassLong = 'First' | 'Upper Second' | 'Lower Second' | 'Third' | 'Fail';
export type ClassificationScheme =
  | { type: 'named' }
  | { type: 'degree_class'; display: 'short' | 'long' };

export interface TemplateBranding {
  primaryColorHex: string;
  secondaryColorHex: string;
  accentColorHex?: string;
  backgroundWatermarkText?: string;
  logoPngBase64?: string;
  sealPngBase64?: string;
  signaturePngBase64?: string;
  issuerName?: string;
  issuerTitle?: string;
}

export interface TemplateTypography {
  titleSize: number;
  nameSize: number;
  bodySize: number;
}

export interface TemplateLayout {
  includeRibbonBadge: boolean;
  badgeText?: string;
  showSealNearSignature: boolean;
}

export interface CertificateTemplate {
  id: string;
  organizationId: string;
  name: string;
  fieldsSchema: Record<string, 'string' | 'number' | 'boolean' | 'date'>;
  pdfLayout: TemplateLayout;
  branding: TemplateBranding;
  typography: TemplateTypography;
  classificationScheme?: ClassificationScheme;
  classificationLabelMap?: Record<string, string>;
  createdAtIso: string;
}

export interface Program {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  degreeLevel: 'certificate' | 'diploma' | 'bachelor' | 'master' | 'doctorate';
  fieldOfStudy: string;
  duration?: string;
  credits?: number;
  isActive: boolean;
  createdAtIso: string;
  updatedAtIso?: string;
}

export interface Student {
  id: string;
  fullName: string;
  email?: string;
  nationalIdHash: string;
  nationalIdSalt: string;
  organizationId: string;
  program?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VerificationEvent {
  id: string;
  certificateId: string;
  verifiedAt: string;
  verifiedBy: string;
  verificationMethod: 'public_id' | 'national_id';
  ipAddress: string;
  userAgent: string;
  result: 'valid' | 'invalid' | 'expired' | 'revoked';
  metadata: Record<string, any>;
}

export interface VerificationResult {
  valid: boolean;
  certificate?: Certificate;
  certificates?: Certificate[]; // Array of all matching certificates (for national ID verification)
  error?: string;
  verificationId?: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
}

// Bulk Operations Types
export interface BulkIssueResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
  certificates: Certificate[];
}

export interface BulkRevokeResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: Array<{
    certificateId: string;
    error: string;
  }>;
}

export interface ReissueResult {
  success: boolean;
  originalCertificate: Certificate;
  newCertificate: Certificate;
  amendments: CertificateAmendment[];
}

export interface CertificateAmendment {
  id: string;
  certificateId: string;
  amendmentType: 'correction' | 'update' | 'reissue';
  reason: string;
  newData: Record<string, any>;
  amendedBy: string;
  amendedAt: string;
  createdAtIso: string;
}

// Statistics Types
export interface CertificateStatistics {
  verifiedToday?: number;
  totalVerified?: number;
  invalidCount?: number;
  pendingCount?: number;
  totalCertificates?: number;
  total: number;
  active: number;
  revoked: number;
  expired: number;
  issuedThisMonth: number;
  issuedThisYear: number;
  byProgram: Array<{
    programId: string;
    programName: string;
    count: number;
  }>;
  byTemplate: Array<{
    templateId: string;
    templateName: string;
    count: number;
  }>;
}

// Search Types
export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  filters: SearchFilters;
}

export interface SearchFilters {
  query?: string;
  organizationId?: string;
  programId?: string;
  templateId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Form Types
export interface IssueCertificateForm {
  studentName: string;
  nationalId: string;
  programId: string;
  templateId: string;
  graduationYear: string;
  grade?: string;
  additionalFields?: Record<string, string>;
}

export interface BulkIssueForm {
  organizationId?: string;
  csvData: string;
  templateId: string;
  programId: string;
  fieldMapping?: Record<string, string>;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  permissions: string[];
}

export type UserRole = 'admin' | 'institution' | 'employer' | 'student' | 'public';

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}
