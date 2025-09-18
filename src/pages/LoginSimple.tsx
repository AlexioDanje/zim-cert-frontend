import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon, 
  AcademicCapIcon, 
  BuildingOfficeIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Institution-based login - role is determined by email domain and credentials
const INSTITUTION_INFO = {
  ministry: {
    name: 'Ministry of Education',
    description: 'Government oversight and administration',
    icon: ShieldCheckIcon,
    color: 'from-red-500 to-red-600',
    domains: ['@education.gov'],
    sampleEmail: 'ministry@education.gov'
  },
  university: {
    name: 'Educational Institutions',
    description: 'Universities, colleges, and institutes',
    icon: AcademicCapIcon,
    color: 'from-blue-500 to-blue-600',
    domains: ['@university.edu', '@college.edu', '@institute.edu'],
    sampleEmail: 'admin@university.edu'
  },
  employer: {
    name: 'Employers & Organizations',
    description: 'HR departments and verification services',
    icon: BuildingOfficeIcon,
    color: 'from-orange-500 to-orange-600',
    domains: ['@company.com', '@corp.com'],
    sampleEmail: 'hr@company.com'
  },
  student: {
    name: 'Students & Graduates',
    description: 'Certificate holders and applicants',
    icon: UserIcon,
    color: 'from-teal-500 to-teal-600',
    domains: ['student@'],
    sampleEmail: 'student@university.edu'
  }
};

// Demo credentials mapped by email
const DEMO_ACCOUNTS = {
  'ministry@education.gov': { role: 'ministry_admin' as UserRole, password: 'ministry123' },
  'admin@university.edu': { role: 'institution_admin' as UserRole, password: 'admin123' },
  'staff@university.edu': { role: 'institution_staff' as UserRole, password: 'staff123' },
  'auditor@education.gov': { role: 'auditor' as UserRole, password: 'auditor123' },
  'hr@company.com': { role: 'employer' as UserRole, password: 'employer123' },
  'student@university.edu': { role: 'student' as UserRole, password: 'student123' },
};

export default function LoginSimple() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<keyof typeof INSTITUTION_INFO>('university');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      // Determine role from email
      const demoAccount = DEMO_ACCOUNTS[data.email as keyof typeof DEMO_ACCOUNTS];
      if (!demoAccount) {
        toast.error('Account not found. Please use a demo account.');
        return;
      }

      await login({
        email: data.email,
        password: data.password,
        role: demoAccount.role,
      });

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const fillDemoCredentials = (institutionKey: keyof typeof INSTITUTION_INFO) => {
    const institution = INSTITUTION_INFO[institutionKey];
    setValue('email', institution.sampleEmail);
    setValue('password', DEMO_ACCOUNTS[institution.sampleEmail as keyof typeof DEMO_ACCOUNTS]?.password || '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <AcademicCapIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ZimCert
              </h1>
              <p className="text-gray-600 dark:text-gray-400">National Certificate System</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-4">
                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-lg">Government-approved security</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-4">
                <AcademicCapIcon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-lg">All institutions unified</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-4">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-lg">Instant verification</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h2>
            <p className="text-gray-600 dark:text-gray-400">Choose your institution type</p>
          </div>

          {/* Institution Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Institution Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(INSTITUTION_INFO).map(([institutionKey, info]) => {
                const IconComponent = info.icon;
                return (
                  <button
                    key={institutionKey}
                    type="button"
                    onClick={() => {
                      setSelectedInstitution(institutionKey as keyof typeof INSTITUTION_INFO);
                      fillDemoCredentials(institutionKey as keyof typeof INSTITUTION_INFO);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedInstitution === institutionKey
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${info.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                      {info.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {info.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={INSTITUTION_INFO[selectedInstitution].sampleEmail}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              <strong>Demo System:</strong> Select institution type above to auto-fill credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
