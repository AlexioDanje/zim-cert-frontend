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
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { verifyApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface VerificationHistoryItem {
  id: string;
  searchType: 'publicId' | 'nationalId';
  searchValue: string;
  candidateName?: string;
  certificateType?: string;
  status: 'valid' | 'invalid' | 'error';
  timestamp: string;
  result?: any;
}

export default function Employer() {
  const { user } = useAuth();
  const [searchType, setSearchType] = useState<'publicId' | 'nationalId'>('publicId');
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistoryItem[]>([]);

  const { data: verificationResult, isLoading, error, refetch } = useQuery({
    queryKey: ['employer-verify', searchType, searchValue],
    queryFn: () => {
      if (searchType === 'publicId') {
        return verifyApi.verifyByPublicId(searchValue);
      } else {
        return verifyApi.verifyByNationalId(searchValue); // Search across all organizations
      }
    },
    enabled: false,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await refetch();
      
      // Add to verification history
      if (result.data) {
        const historyItem: VerificationHistoryItem = {
          id: Date.now().toString(),
          searchType,
          searchValue,
          candidateName: result.data.certificate?.payload?.fields?.studentName || 'Unknown',
          certificateType: result.data.certificate?.payload?.fields?.certificateType || 'Certificate',
          status: result.data.valid ? 'valid' : 'invalid',
          timestamp: new Date().toISOString(),
          result: result.data
        };
        
        setVerificationHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
      }
    } catch (err) {
      // Add error to history
      const historyItem: VerificationHistoryItem = {
        id: Date.now().toString(),
        searchType,
        searchValue,
        candidateName: 'Unknown',
        certificateType: 'Unknown',
        status: 'error',
        timestamp: new Date().toISOString()
      };
      
      setVerificationHistory(prev => [historyItem, ...prev.slice(0, 9)]);
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
                <div className="space-y-6">
                  {verificationResult.valid ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-start">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-emerald-800 font-semibold text-xl">✅ Certificate Verified Successfully</div>
                        <div className="text-emerald-700 mt-1">
                          {verificationResult.certificates && verificationResult.certificates.length > 1 
                            ? `Found ${verificationResult.certificates.length} certificates for this ${searchType === 'nationalId' ? 'National ID' : 'Certificate ID'}.`
                            : 'This certificate is authentic and valid.'
                          }
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <XCircleIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-red-800 font-semibold text-xl">❌ Verification Failed</div>
                        <div className="text-red-700 mt-1">No valid certificate found for this {searchType === 'nationalId' ? 'National ID' : 'Certificate ID'}.</div>
                      </div>
                    </div>
                  )}

                  {/* Multiple Certificates Summary for National ID */}
                  {verificationResult.certificates && verificationResult.certificates.length > 1 && searchType === 'nationalId' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <DocumentTextIcon className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-lg font-semibold text-blue-900">All Certificates for this National ID</h3>
                      </div>
                      <div className="grid gap-4">
                        {verificationResult.certificates.map((cert, index) => (
                          <div key={cert.id} className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                    #{index + 1}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {cert.payload?.fields?.certificateType || 'Certificate'}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {cert.payload?.fields?.graduationYear || new Date(cert.createdAtIso).getFullYear()}
                                  </span>
                                </div>
                                <div className="mt-1 text-sm text-gray-600">
                                  <strong>{cert.payload?.fields?.studentName}</strong> - {cert.payload?.fields?.programName}
                                  {cert.payload?.fields?.grade && (
                                    <span className="ml-2 text-blue-600 font-medium">Grade: {cert.payload.fields.grade}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                  cert.status === 'issued' ? 'bg-green-100 text-green-800' : 
                                  cert.status === 'revoked' ? 'bg-red-100 text-red-800' : 
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {cert.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Single Certificate Details */}
                  {verificationResult.certificate && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-emerald-600 mr-2" />
                        Certificate Details
                      </h5>
                      <dl className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <dt className="text-sm font-medium text-gray-500">Student Name</dt>
                          <dd className="text-sm font-bold text-gray-900">{verificationResult.certificate.payload?.fields?.studentName || '-'}</dd>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <dt className="text-sm font-medium text-gray-500">Certificate Type</dt>
                          <dd className="text-sm font-bold text-gray-900">{verificationResult.certificate.payload?.fields?.certificateType || '-'}</dd>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <dt className="text-sm font-medium text-gray-500">Program</dt>
                          <dd className="text-sm font-bold text-gray-900">{verificationResult.certificate.payload?.fields?.programName || '-'}</dd>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <dt className="text-sm font-medium text-gray-500">Grade</dt>
                          <dd className="text-sm font-bold text-gray-900">{verificationResult.certificate.payload?.fields?.grade || 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                          <dd className="text-sm font-bold text-gray-900">{verificationResult.certificate.createdAtIso ? new Date(verificationResult.certificate.createdAtIso).toLocaleDateString() : '-'}</dd>
                        </div>
                      </dl>
                    </div>
                  )}
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
                  {verificationHistory.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center">
                          <ClockIcon className="h-8 w-8 text-gray-300 mb-2" />
                          <p>No verification history yet</p>
                          <p className="text-xs mt-1">Perform certificate verifications to see history here</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    verificationHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {item.candidateName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.certificateType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'valid' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : item.status === 'invalid'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {item.status === 'valid' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                            {item.status === 'invalid' && <XCircleIcon className="h-3 w-3 mr-1" />}
                            {item.status === 'error' && <ExclamationTriangleIcon className="h-3 w-3 mr-1" />}
                            {item.status === 'valid' ? 'Valid' : item.status === 'invalid' ? 'Invalid' : 'Error'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
