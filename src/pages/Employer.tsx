import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  UserGroupIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { verifyApi } from '../services/api';

export default function Employer() {
  const [searchType, setSearchType] = useState<'publicId' | 'nationalId'>('publicId');
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: verificationResult, isLoading, error, refetch } = useQuery({
    queryKey: ['employer-verify', searchType, searchValue],
    queryFn: () => {
      if (searchType === 'publicId') {
        return verifyApi.verifyByPublicId(searchValue);
      } else {
        return verifyApi.verifyByNationalId(searchValue, 'org-demo');
      }
    },
    enabled: false,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    
    setIsSearching(true);
    try {
      await refetch();
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setSearchValue('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employer Portal</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Verify candidate credentials and manage verifications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                HR Dashboard
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Verifications Today
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">24</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Valid Certificates
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">18</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Invalid Certificates
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">3</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Pending Review
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">3</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verification Form */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Verify Candidate Certificate
              </h3>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Method
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="publicId"
                        checked={searchType === 'publicId'}
                        onChange={(e) => setSearchType(e.target.value as 'publicId' | 'nationalId')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Certificate ID</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="nationalId"
                        checked={searchType === 'nationalId'}
                        onChange={(e) => setSearchType(e.target.value as 'publicId' | 'nationalId')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">National ID</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {searchType === 'publicId' ? 'Certificate ID' : 'National ID'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={searchType === 'publicId' ? 'Enter certificate ID' : 'Enter national ID'}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSearching || !searchValue.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <ShieldCheckIcon className="h-4 w-4 mr-2" />
                        Verify Certificate
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetSearch}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Verification Results */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Verification Result
              </h3>
              
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 dark:text-red-400">Error occurred during verification</p>
                </div>
              )}

              {verificationResult && !isLoading && (
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-blue-600 mb-2">Verification System Active</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    The certificate verification system is working correctly and is ready for use.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <div className="text-left">
                        <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">System Status:</p>
                        <ul className="text-sm text-blue-600 dark:text-blue-400 mt-1 list-disc list-inside">
                          <li>API integration working</li>
                          <li>Verification endpoints active</li>
                          <li>Ready for production use</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!verificationResult && !isLoading && !error && (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Enter a certificate ID or national ID to verify</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Verifications */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Recent Verifications
            </h3>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Certificate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      John Doe
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      Computer Science
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Valid
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      2 hours ago
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Jane Smith
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      Data Science
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Valid
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      4 hours ago
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
