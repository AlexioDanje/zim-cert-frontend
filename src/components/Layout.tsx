import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import type { UserRole } from '../types/auth';
import {
  HomeIcon,
  DocumentTextIcon,
  PlusIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles: (UserRole | 'public')[];
  requiredPermissions: string[];
}

const getRoleDisplayName = (role?: UserRole): string => {
  const roleNames = {
    ministry_admin: 'Ministry Administrator',
    institution_admin: 'Institution Administrator',
    institution_staff: 'Institution Staff',
    auditor: 'Government Auditor',
    employer: 'Employer',
    student: 'Student',
    public: 'Public User'
  };
  return role ? roleNames[role] || role : 'Public User';
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasRole, hasPermission } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define all possible navigation items with their required roles and permissions
  const getAllNavigationItems = (): NavigationItem[] => [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon, 
      requiredRoles: ['ministry_admin', 'institution_admin', 'institution_staff', 'auditor', 'employer', 'student', 'public'],
      requiredPermissions: []
    },
    { 
      name: 'Government Dashboard', 
      href: '/government', 
      icon: ChartBarIcon, 
      requiredRoles: ['ministry_admin', 'auditor'],
      requiredPermissions: ['reports:read']
    },
    { 
      name: 'Institutions', 
      href: '/institutions', 
      icon: BuildingOffice2Icon, 
      requiredRoles: ['ministry_admin'],
      requiredPermissions: [] // Ministry admin has '*' permission, so no specific check needed
    },
    { 
      name: 'Certificates', 
      href: '/certificates', 
      icon: DocumentTextIcon, 
      requiredRoles: ['ministry_admin', 'institution_admin', 'institution_staff', 'auditor', 'student'],
      requiredPermissions: ['certificates:read']
    },
    { 
      name: 'Issue Certificate', 
      href: '/issue', 
      icon: PlusIcon, 
      requiredRoles: ['institution_admin', 'institution_staff'],
      requiredPermissions: ['certificates:create']
    },
    { 
      name: 'Bulk Operations', 
      href: '/bulk', 
      icon: ChartBarIcon, 
      requiredRoles: ['institution_admin'],
      requiredPermissions: ['bulk:create']
    },
    { 
      name: 'Programs', 
      href: '/programs', 
      icon: AcademicCapIcon, 
      requiredRoles: ['institution_admin', 'institution_staff', 'auditor'],
      requiredPermissions: ['programs:read']
    },
    { 
      name: 'Students', 
      href: '/students', 
      icon: UserGroupIcon, 
      requiredRoles: ['ministry_admin', 'institution_admin', 'institution_staff', 'auditor'],
      requiredPermissions: ['students:read']
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: ChartBarIcon, 
      requiredRoles: ['ministry_admin', 'institution_admin', 'auditor'],
      requiredPermissions: ['reports:read']
    },
    { 
      name: 'Verify Certificate', 
      href: '/verification', 
      icon: ShieldCheckIcon, 
      requiredRoles: ['ministry_admin', 'institution_admin', 'institution_staff', 'auditor', 'employer', 'student', 'public'],
      requiredPermissions: []
    },
    { 
      name: 'My Certificates', 
      href: '/certificates', 
      icon: DocumentTextIcon, 
      requiredRoles: ['student'],
      requiredPermissions: ['certificates:read:own']
    },
    { 
      name: 'Verification History', 
      href: '/verification-history', 
      icon: ChartBarIcon, 
      requiredRoles: ['ministry_admin', 'institution_admin', 'institution_staff', 'auditor', 'employer', 'student'],
      requiredPermissions: ['verification:read']
    }
  ];

  // Professional navigation filtering based on user role and permissions
  const allNavigationItems = getAllNavigationItems();
  
  const navigation = !user 
    ? allNavigationItems.filter(item => item.requiredRoles.includes('public'))
    : allNavigationItems.filter(item => {
        // Check if user has required role
        const hasRequiredRole = item.requiredRoles.some(role => hasRole(role as any));
        
        // Check if user has required permissions (if any specified)
        const hasRequiredPermissions = item.requiredPermissions.length === 0 || 
          item.requiredPermissions.some(permission => hasPermission(permission));
        
        return hasRequiredRole && hasRequiredPermissions;
      });

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ZIM Cert</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isCurrentPath(item.href)
                        ? 'nav-item-active'
                        : 'nav-item'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={`${
                        isCurrentPath(item.href)
                          ? 'icon-primary'
                          : 'icon-secondary group-hover:icon-primary'
                      } mr-4 h-6 w-6 transition-colors`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-secondary p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-8 w-8 icon-secondary" />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-sm font-medium text-secondary">
                  {user?.role || 'Public'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 border-r border-secondary">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ZIM Cert</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isCurrentPath(item.href)
                          ? 'nav-item-active'
                          : 'nav-item'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                    >
                      <Icon
                        className={`${
                          isCurrentPath(item.href)
                            ? 'icon-primary'
                            : 'icon-secondary group-hover:icon-primary'
                        } mr-3 h-5 w-5 transition-colors`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-secondary p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-8 w-8 icon-secondary" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name || 'Guest'}
                  </p>
                  <p className="text-xs font-medium text-secondary">
                    {user?.organizationName || getRoleDisplayName(user?.role)}
                  </p>
                  {user?.role && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getRoleDisplayName(user.role)}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <button
                    onClick={handleLogout}
                    className="icon-secondary hover:icon-danger transition-colors"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 border-b border-secondary">
          <button
            type="button"
            className="px-4 border-r border-secondary text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600 dark:focus-within:text-gray-300">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <ShieldCheckIcon className="h-5 w-5" />
                  </div>
                  <div className="block w-full pl-8 pr-3 py-2 border-transparent rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                    Certificate Management System
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                {user && (
                  <button
                    onClick={handleLogout}
                    className="bg-white dark:bg-gray-700 p-1 rounded-full icon-secondary hover:icon-danger focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
