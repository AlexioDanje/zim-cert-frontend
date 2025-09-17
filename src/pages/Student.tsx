import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  AcademicCapIcon, 
  DocumentTextIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  TrophyIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { verifyApi } from '../services/api';

export default function Student() {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: verificationResult, isLoading, error, refetch } = useQuery({
    queryKey: ['student-verify', searchValue],
    queryFn: () => verifyApi.verifyByNationalId(searchValue, 'org-demo'),
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
              <AcademicCapIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Portal</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">View your certificates and academic achievements</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <UserIcon className="h-4 w-4 mr-1" />
                Student Dashboard
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
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Certificates
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
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Verified Certificates
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
                  <TrophyIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Achievements
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">5</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Graduation Year
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">2024</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Form */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Search Your Certificates
              </h3>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    National ID
                  </label>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Enter your national ID"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSearching || !searchValue.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <AcademicCapIcon className="h-4 w-4 mr-2" />
                        Search Certificates
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

          {/* Search Results */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Search Results
              </h3>
              
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <div className="h-6 w-6 text-red-600">!</div>
                  </div>
                  <p className="text-red-600 dark:text-red-400">Error occurred during search</p>
                </div>
              )}

              {verificationResult && !isLoading && (
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-purple-600 mb-2">Search Complete</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    The certificate search system is working correctly. Your certificates are being processed.
                  </p>
                  <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-3" />
                      <div className="text-left">
                        <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">System Status:</p>
                        <ul className="text-sm text-purple-600 dark:text-purple-400 mt-1 list-disc list-inside">
                          <li>Search system active</li>
                          <li>API integration working</li>
                          <li>Ready to view certificates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!verificationResult && !isLoading && !error && (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Enter your national ID to search for certificates</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Certificates */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              My Certificates
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Certificate Card 1 */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Computer Science</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bachelor's Degree</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Graduated: June 2024
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <TrophyIcon className="h-4 w-4 mr-2" />
                    Grade: A+
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-purple-600 text-sm font-medium py-2 px-3 rounded-md border border-purple-300 dark:border-purple-600 transition-colors duration-200 flex items-center justify-center">
                    <ShareIcon className="h-4 w-4 mr-1" />
                    Share
                  </button>
                  <button className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-purple-600 text-sm font-medium py-2 px-3 rounded-md border border-purple-300 dark:border-purple-600 transition-colors duration-200 flex items-center justify-center">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>

              {/* Certificate Card 2 */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Data Science</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Certificate</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Completed: March 2024
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <TrophyIcon className="h-4 w-4 mr-2" />
                    Grade: A
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-blue-600 text-sm font-medium py-2 px-3 rounded-md border border-blue-300 dark:border-blue-600 transition-colors duration-200 flex items-center justify-center">
                    <ShareIcon className="h-4 w-4 mr-1" />
                    Share
                  </button>
                  <button className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-blue-600 text-sm font-medium py-2 px-3 rounded-md border border-blue-300 dark:border-blue-600 transition-colors duration-200 flex items-center justify-center">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>

              {/* Certificate Card 3 */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Machine Learning</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Specialization</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Completed: May 2024
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <TrophyIcon className="h-4 w-4 mr-2" />
                    Grade: A+
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-green-600 text-sm font-medium py-2 px-3 rounded-md border border-green-300 dark:border-green-600 transition-colors duration-200 flex items-center justify-center">
                    <ShareIcon className="h-4 w-4 mr-1" />
                    Share
                  </button>
                  <button className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-green-600 text-sm font-medium py-2 px-3 rounded-md border border-green-300 dark:border-green-600 transition-colors duration-200 flex items-center justify-center">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
