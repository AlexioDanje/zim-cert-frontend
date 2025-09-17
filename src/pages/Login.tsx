import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, AcademicCapIcon, BuildingOfficeIcon, UserGroupIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'institution', 'employer', 'student']),
});

type LoginForm = z.infer<typeof loginSchema>;

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@zimcert.com', password: 'admin123' },
  institution: { email: 'institution@university.edu', password: 'institution123' },
  employer: { email: 'hr@company.com', password: 'employer123' },
  student: { email: 'student@university.edu', password: 'student123' },
};

const ROLE_INFO = {
  admin: {
    title: 'System Administrator',
    description: 'Full system access and management',
    icon: ShieldCheckIcon,
    color: 'gradient-danger'
  },
  institution: {
    title: 'Educational Institution',
    description: 'Issue and manage certificates',
    icon: AcademicCapIcon,
    color: 'gradient-primary'
  },
  employer: {
    title: 'Employer',
    description: 'Verify and validate certificates',
    icon: BuildingOfficeIcon,
    color: 'gradient-success'
  },
  student: {
    title: 'Student',
    description: 'View and download certificates',
    icon: UserGroupIcon,
    color: 'gradient-info'
  }
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'institution' | 'employer' | 'student'>('institution');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'institution'
    }
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login({ email: data.email, password: data.password, role: selectedRole });
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const fillDemoCredentials = () => {
    const credentials = DEMO_CREDENTIALS[selectedRole];
    return credentials;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r gradient-primary rounded-2xl mb-6">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to ZIM Cert
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Secure, transparent, and blockchain-inspired digital certificate management
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-4">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-lg">Cryptographically secure verification</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-4">
                  <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-lg">Trusted by educational institutions</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-4">
                  <SparklesIcon className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-lg">Instant verification results</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose your role and enter your credentials</p>
            </div>

            {/* Role Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(ROLE_INFO).map(([role, info]) => {
                  const IconComponent = info.icon;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role as any)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedRole === role
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{info.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{info.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <input type="hidden" {...register('role')} value={selectedRole} />
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r gradient-primary text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Demo Credentials</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-mono text-gray-900 dark:text-white">{fillDemoCredentials().email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Password:</span>
                  <span className="font-mono text-gray-900 dark:text-white">{fillDemoCredentials().password}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                  Contact administrator
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
