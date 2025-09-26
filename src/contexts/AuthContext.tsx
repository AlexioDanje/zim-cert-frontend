import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole, LoginCredentials, AuthContextType } from '../types/auth';
import { api } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo MOCK_USERS removed; backend auth is used

// Helper function to determine institution type from role
const getInstitutionType = (role: UserRole): string => {
  switch (role) {
    case 'ministry_admin':
    case 'auditor':
      return 'ministry';
    case 'institution_admin':
    case 'institution_staff':
      return 'university';
    case 'employer':
      return 'employer';
    case 'student':
      return 'university';
    default:
      return 'unknown';
  }
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
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('zimcert_user');
      const accessToken = localStorage.getItem('zimcert_access_token');
      const refreshToken = localStorage.getItem('zimcert_refresh_token');

      if (savedUser && accessToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Verify token is still valid by calling profile endpoint
          try {
            await api.get('/auth/profile');
          } catch (err) {
            // Token is invalid, try to refresh
            if (refreshToken) {
              try {
                const response = await api.post('/auth/refresh', { refreshToken });
                if (response.data.success) {
                  const { accessToken: newAccessToken } = response.data.data;
                  localStorage.setItem('zimcert_access_token', newAccessToken);
                } else {
                  throw new Error('Refresh failed');
                }
              } catch (refreshErr) {
                // Refresh failed, clear everything
                localStorage.removeItem('zimcert_user');
                localStorage.removeItem('zimcert_access_token');
                localStorage.removeItem('zimcert_refresh_token');
                setUser(null);
              }
            } else {
              // No refresh token, clear everything
              localStorage.removeItem('zimcert_user');
              localStorage.removeItem('zimcert_access_token');
              setUser(null);
            }
          }
        } catch (err) {
          localStorage.removeItem('zimcert_user');
          localStorage.removeItem('zimcert_access_token');
          localStorage.removeItem('zimcert_refresh_token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Call real authentication API
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      if (!response.data.success) {
        throw new Error(response.data.error?.message || response.data.message || 'Login failed');
      }

      const { token, refreshToken, user: userData } = response.data.data;

      // Store tokens
      localStorage.setItem('zimcert_access_token', token);
      localStorage.setItem('zimcert_refresh_token', refreshToken);

      // Transform backend user data to frontend format
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.profileData?.fullName || userData.email,
        role: userData.role,
        organizationId: userData.organizationId,
        organizationName: userData.profileData?.institutionName || 
                         userData.profileData?.companyName || 
                         'Unknown Organization',
        institutionType: getInstitutionType(userData.role) as 'university' | 'college' | 'institute' | 'ministry' | 'auditor' | 'employer',
        permissions: ROLE_PERMISSIONS[userData.role],
        isActive: userData.status === 'active',
        createdAt: userData.createdAt || userData.createdAtIso,
      };

      setUser(user);
      localStorage.setItem('zimcert_user', JSON.stringify(user));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate refresh token
      const refreshToken = localStorage.getItem('zimcert_refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      // Ignore logout API errors, still clear local state
      console.warn('Logout API call failed:', err);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      setError(null);
      localStorage.removeItem('zimcert_user');
      localStorage.removeItem('zimcert_access_token');
      localStorage.removeItem('zimcert_refresh_token');
    }
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
