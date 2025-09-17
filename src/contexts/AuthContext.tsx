import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole, LoginCredentials, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: Record<string, User> = {
  'admin@zimcert.com': {
    id: '1',
    email: 'admin@zimcert.com',
    name: 'System Administrator',
    role: 'admin',
    permissions: ['*'], // All permissions
  },
  'institution@university.edu': {
    id: '2',
    email: 'institution@university.edu',
    name: 'University Registrar',
    role: 'institution',
    organizationId: 'org-university',
    permissions: [
      'certificates:create',
      'certificates:read',
      'certificates:update',
      'certificates:revoke',
      'students:read',
      'students:create',
      'programs:read',
      'programs:create',
      'templates:read',
      'templates:create',
      'reports:read',
      'bulk:create',
    ],
  },
  'hr@company.com': {
    id: '3',
    email: 'hr@company.com',
    name: 'HR Manager',
    role: 'employer',
    organizationId: 'org-company',
    permissions: [
      'certificates:verify',
      'verification:read',
    ],
  },
  'student@university.edu': {
    id: '4',
    email: 'student@university.edu',
    name: 'John Student',
    role: 'student',
    organizationId: 'org-university',
    permissions: [
      'certificates:read:own',
      'verification:read:own',
    ],
  },
};

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'],
  institution: [
    'certificates:create',
    'certificates:read',
    'certificates:update',
    'certificates:revoke',
    'students:read',
    'students:create',
    'programs:read',
    'programs:create',
    'templates:read',
    'templates:create',
    'reports:read',
    'bulk:create',
  ],
  employer: [
    'certificates:verify',
    'verification:read',
  ],
  student: [
    'certificates:read:own',
    'verification:read:own',
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
