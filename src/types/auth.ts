export type UserRole = 
  | 'ministry_admin'      // Ministry of Education - full system control
  | 'institution_admin'   // Institution administrator - full institution control
  | 'institution_staff'   // Institution staff - certificate issuance only
  | 'auditor'            // Government auditor - read-only access
  | 'employer'           // Employer - verification only
  | 'student'            // Student - view own certificates
  | 'public';            // Public - verification only

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  institutionType?: 'university' | 'college' | 'institute' | 'ministry' | 'auditor' | 'employer';
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}
