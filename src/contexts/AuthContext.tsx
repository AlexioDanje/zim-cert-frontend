import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole, LoginCredentials, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for national certificate system demo
const MOCK_USERS: Record<string, User> = {
  'ministry@education.gov': {
    id: '1',
    email: 'ministry@education.gov',
    name: 'Dr. Sarah Minister',
    role: 'ministry_admin',
    organizationId: 'ministry-education',
    organizationName: 'Ministry of Education',
    institutionType: 'ministry',
    permissions: ['*'], // Full system access
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  'admin@university.edu': {
    id: '2',
    email: 'admin@university.edu',
    name: 'Prof. John Registrar',
    role: 'institution_admin',
    organizationId: 'org-university',
    organizationName: 'National University',
    institutionType: 'university',
    permissions: [
      'certificates:create',
      'certificates:read',
      'certificates:update',
      'certificates:revoke',
      'students:create',
      'students:read',
      'students:update',
      'programs:create',
      'programs:read',
      'programs:update',
      'programs:delete',
      'reports:read',
      'bulk:create',
      'institution:manage',
    ],
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  'staff@university.edu': {
    id: '3',
    email: 'staff@university.edu',
    name: 'Mary Certificate Officer',
    role: 'institution_staff',
    organizationId: 'org-university',
    organizationName: 'National University',
    institutionType: 'university',
    permissions: [
      'certificates:create',
      'certificates:read',
      'students:read',
      'programs:read',
    ],
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  'auditor@education.gov': {
    id: '4',
    email: 'auditor@education.gov',
    name: 'David Compliance Officer',
    role: 'auditor',
    organizationId: 'ministry-education',
    organizationName: 'Ministry of Education - Audit Division',
    institutionType: 'auditor',
    permissions: [
      'certificates:read',
      'students:read',
      'programs:read',
      'reports:read',
      'audit:read',
    ],
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  'hr@company.com': {
    id: '5',
    email: 'hr@company.com',
    name: 'Lisa HR Manager',
    role: 'employer',
    organizationId: 'org-company',
    organizationName: 'Tech Solutions Ltd',
    institutionType: 'employer',
    permissions: [
      'certificates:verify',
      'verification:read',
    ],
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  'student@university.edu': {
    id: '6',
    email: 'student@university.edu',
    name: 'Alex Student',
    role: 'student',
    organizationId: 'org-university',
    organizationName: 'National University',
    institutionType: 'university',
    permissions: [
      'certificates:read:own',
      'verification:read:own',
    ],
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
};

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ministry_admin: ['*'], // Full system access
  institution_admin: [
    'certificates:create',
    'certificates:read', 
    'certificates:update',
    'certificates:revoke',
    'students:create',
    'students:read',
    'students:update',
    'programs:create',
    'programs:read',
    'programs:update',
    'programs:delete',
    'reports:read',
    'bulk:create',
    'institution:manage',
    'verification:read',
  ],
  institution_staff: [
    'certificates:create',
    'certificates:read',
    'students:read',
    'programs:read',
    'verification:read',
  ],
  auditor: [
    'certificates:read',
    'students:read',
    'programs:read',
    'reports:read',
    'audit:read',
    'verification:read',
  ],
  employer: [
    'certificates:verify',
    'verification:read',
  ],
  student: [
    'certificates:read:own',
    'verification:read',
  ],
  public: [
    'verification:public',
  ],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('zimcert_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        localStorage.removeItem('zimcert_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists
      const user = MOCK_USERS[credentials.email];
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // For demo purposes, accept any password
      if (user.role !== credentials.role) {
        throw new Error('Invalid role for this user');
      }

      // Set user permissions based on role
      const userWithPermissions = {
        ...user,
        permissions: ROLE_PERMISSIONS[user.role],
      };

      setUser(userWithPermissions);
      localStorage.setItem('zimcert_user', JSON.stringify(userWithPermissions));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('zimcert_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
