import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  SparklesIcon,
  StarIcon,
  LockClosedIcon,
  ClockIcon,
  ChartBarIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r gradient-primary rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ZIM Cert</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/verification"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                Verify Certificate
              </Link>
              <Link
                to="/login"
                className="bg-gradient-to-r gradient-primary text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r gradient-primary rounded-2xl mb-8 shadow-2xl">
              <ShieldCheckIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Secure Digital Certificates
            </h1>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Blockchain-inspired, cryptographically secure digital certificate management 
              for educational institutions, employers, and students worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/verification"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r gradient-primary text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                <ShieldCheckIcon className="w-6 h-6 mr-3" />
                Verify Certificate
                <ArrowRightIcon className="w-5 h-5 ml-3" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                <AcademicCapIcon className="w-6 h-6 mr-3" />
                Institution Portal
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <LockClosedIcon className="w-5 h-5 mr-2 text-green-500" />
                Cryptographically Secure
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-blue-500" />
                Instant Verification
              </div>
              <div className="flex items-center">
                <GlobeAltIcon className="w-5 h-5 mr-2 text-purple-500" />
                Global Access
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ZIM Cert?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with user-friendly design 
              to provide the most secure and efficient certificate management solution
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blockchain Security</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Cryptographically secure certificates with immutable verification records 
                ensuring authenticity and preventing fraud
              </p>
            </div>
            <div className="group p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Instant Verification</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Real-time certificate verification with immediate results, 
                making it easy for employers to validate credentials
              </p>
            </div>
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Advanced Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Comprehensive reporting and analytics to track certificate issuance, 
                verification patterns, and system performance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Selection */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Portal
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tailored experiences for different user types with role-based access and functionality
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              to="/login"
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-r gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <AcademicCapIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Institution</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
                Issue, manage, and track digital certificates for your students
              </p>
              <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 font-semibold">
                Access Portal
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/login"
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BuildingOfficeIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Employer</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
                Verify candidate credentials and validate certificate authenticity
              </p>
              <div className="flex items-center justify-center text-green-600 group-hover:text-green-700 font-semibold">
                Access Portal
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/login"
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Student</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
                View, download, and share your digital certificates securely
              </p>
              <div className="flex items-center justify-center text-purple-600 group-hover:text-purple-700 font-semibold">
                Access Portal
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/verification"
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Public Verification</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
                Verify any certificate instantly without requiring an account
              </p>
              <div className="flex items-center justify-center text-orange-600 group-hover:text-orange-700 font-semibold">
                Verify Now
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join the growing community of institutions and organizations using ZIM Cert
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">25+</div>
              <div className="text-blue-100">Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">5,000+</div>
              <div className="text-blue-100">Students</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">1,250+</div>
              <div className="text-blue-100">Certificates</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r gradient-primary rounded-xl flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">ZIM Cert</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Secure, transparent, and blockchain-inspired digital certificate management 
                for educational institutions and employers worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <HeartIcon className="w-5 h-5 text-red-500" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/verification" className="hover:text-white transition-colors">Verification</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Institution Portal</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Employer Portal</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Student Portal</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ZIM Cert. All rights reserved. Built with ❤️ for secure education.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
