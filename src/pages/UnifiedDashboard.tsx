import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  PlusIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { certificateApi, studentApi, programApi, templateApi } from '../services/api';

export default function UnifiedDashboard() {
  const { user } = useAuth();

  // Fetch data based on user role
  const { data: certificates } = useQuery({
    queryKey: ['certificates', user?.organizationId],
    queryFn: () => certificateApi.list(user?.organizationId || 'org-demo'),
    enabled: !!user?.organizationId
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentApi.list(),
    enabled: ['institution', 'admin'].includes(user?.role || '')
  });

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programApi.list(),
    enabled: ['institution', 'admin'].includes(user?.role || '')
  });

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templateApi.list(),
    enabled: ['institution', 'admin'].includes(user?.role || '')
  });

  const { data: statistics } = useQuery({
    queryKey: ['certificate-statistics', user?.organizationId],
    queryFn: () => certificateApi.statistics(user?.organizationId || 'org-demo'),
    enabled: ['institution', 'admin', 'employer'].includes(user?.role || '')
  });

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case 'admin':
      case 'institution':
        return {
          title: 'Institution Dashboard',
          description: 'Manage certificates, students, and programs',
          stats: [
            {
              name: 'Total Certificates',
              value: certificates?.length || 0,
              icon: DocumentTextIcon,
              color: 'stats-icon-emerald',
              change: '+12%',
              changeType: 'positive'
            },
            {
              name: 'Active Students',
              value: students?.length || 0,
              icon: UserGroupIcon,
              color: 'stats-icon-blue',
              change: '+8%',
              changeType: 'positive'
            },
            {
              name: 'Programs',
              value: programs?.length || 0,
              icon: AcademicCapIcon,
              color: 'stats-icon-purple',
              change: '+2',
              changeType: 'positive'
            },
            {
              name: 'Templates',
              value: templates?.length || 0,
              icon: DocumentTextIcon,
              color: 'stats-icon-orange',
              change: '+1',
              changeType: 'positive'
            }
          ],
          quickActions: [
            { name: 'Issue Certificate', href: '/issue', icon: PlusIcon, color: 'gradient-primary' },
            { name: 'Bulk Operations', href: '/bulk', icon: ChartBarIcon, color: 'gradient-info' },
            { name: 'Manage Students', href: '/students', icon: UserGroupIcon, color: 'gradient-success' },
            { name: 'View Reports', href: '/reports', icon: ChartBarIcon, color: 'gradient-warning' }
          ]
        };

      case 'employer':
        return {
          title: 'Employer Dashboard',
          description: 'Verify certificates and manage verification records',
          stats: [
            {
              name: 'Verified Today',
              value: statistics?.verifiedToday || 0,
              icon: CheckCircleIcon,
              color: 'stats-icon-emerald',
              change: '+5',
              changeType: 'positive'
            },
            {
              name: 'Total Verified',
              value: statistics?.totalVerified || 0,
              icon: ShieldCheckIcon,
              color: 'stats-icon-blue',
              change: '+23%',
              changeType: 'positive'
            },
            {
              name: 'Invalid Certificates',
              value: statistics?.invalidCount || 0,
              icon: ExclamationTriangleIcon,
              color: 'stats-icon-red',
              change: '-2',
              changeType: 'negative'
            },
            {
              name: 'Pending Verification',
              value: statistics?.pendingCount || 0,
              icon: ClockIcon,
              color: 'stats-icon-yellow',
              change: '+3',
              changeType: 'positive'
            }
          ],
          quickActions: [
            { name: 'Verify Certificate', href: '/verification', icon: ShieldCheckIcon, color: 'gradient-primary' },
            { name: 'Verification History', href: '/verification', icon: ChartBarIcon, color: 'gradient-info' }
          ]
        };

      case 'student':
        return {
          title: 'Student Dashboard',
          description: 'View your certificates and verification status',
          stats: [
            {
              name: 'My Certificates',
              value: certificates?.length || 0,
              icon: DocumentTextIcon,
              color: 'stats-icon-emerald',
              change: '+1',
              changeType: 'positive'
            },
            {
              name: 'Verified',
              value: certificates?.filter(c => c.status === 'active').length || 0,
              icon: CheckCircleIcon,
              color: 'stats-icon-blue',
              change: '100%',
              changeType: 'positive'
            },
            {
              name: 'Programs Enrolled',
              value: programs?.length || 0,
              icon: AcademicCapIcon,
              color: 'stats-icon-purple',
              change: '+1',
              changeType: 'positive'
            }
          ],
          quickActions: [
            { name: 'View My Certificates', href: '/certificates', icon: DocumentTextIcon, color: 'gradient-primary' },
            { name: 'Verify Certificate', href: '/verification', icon: ShieldCheckIcon, color: 'gradient-success' }
          ]
        };

      default:
        return {
          title: 'Public Dashboard',
          description: 'Access certificate verification and information',
          stats: [
            {
              name: 'Certificates Available',
              value: statistics?.totalCertificates || 0,
              icon: DocumentTextIcon,
              color: 'stats-icon-emerald',
              change: '+15%',
              changeType: 'positive'
            },
            {
              name: 'Active Programs',
              value: programs?.length || 0,
              icon: AcademicCapIcon,
              color: 'stats-icon-blue',
              change: '+3',
              changeType: 'positive'
            }
          ],
          quickActions: [
            { name: 'Verify Certificate', href: '/verification', icon: ShieldCheckIcon, color: 'gradient-primary' },
            { name: 'Browse Programs', href: '/programs', icon: AcademicCapIcon, color: 'gradient-info' }
          ]
        };
    }
  };

  const content = getRoleBasedContent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                {content.title}
              </h2>
              <p className="mt-1 text-sm text-secondary">
                {content.description}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <BuildingOfficeIcon className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role: <span className="text-primary font-semibold capitalize">{user?.role || 'Public'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {content.stats.map((stat, index) => (
          <div key={index} className="stats-card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-md flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors"
              >
                <div>
                  <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                    <action.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {action.name}
                  </h3>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-1zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {certificates?.slice(0, 5).map((certificate, index) => (
                <li key={certificate.id}>
                  <div className="relative pb-8">
                    {index !== certificates.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                          <DocumentTextIcon className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-secondary">
                            Certificate <span className="font-medium text-gray-900 dark:text-white">{certificate.publicId}</span> was issued
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-secondary">
                          <time dateTime={certificate.createdAt}>
                            {new Date(certificate.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
