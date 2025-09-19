import { useState } from 'react';
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface VerificationHistoryItem {
  id: string;
  searchType: 'publicId' | 'nationalId';
  searchValue: string;
  candidateName: string;
  result: {
    valid: boolean;
    certificate?: any;
    certificates?: any[];
    error?: string;
  };
  timestamp: string;
}

export default function VerificationHistory() {
  const { user } = useAuth();
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistoryItem[]>([
    // Mock data for demo
    {
      id: '1',
      searchType: 'publicId',
      searchValue: 'CERT-2024-001',
      candidateName: 'John Doe',
      result: {
        valid: true,
        certificate: {
          id: 'CERT-2024-001',
          studentName: 'John Doe',
          programName: 'Computer Science',
          issueDate: '2024-01-15',
          status: 'issued'
        }
      },
      timestamp: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      searchType: 'nationalId',
      searchValue: '48-123456-A78',
      candidateName: 'Jane Smith',
      result: {
        valid: true,
        certificates: [
          {
            id: 'CERT-2024-002',
            studentName: 'Jane Smith',
            programName: 'Business Administration',
            issueDate: '2024-01-10',
            status: 'issued'
          },
          {
            id: 'CERT-2023-045',
            studentName: 'Jane Smith',
            programName: 'Marketing Certificate',
            issueDate: '2023-12-05',
            status: 'issued'
          }
        ]
      },
      timestamp: '2024-01-19T14:20:00Z'
    },
    {
      id: '3',
      searchType: 'publicId',
      searchValue: 'CERT-2024-999',
      candidateName: 'Unknown',
      result: {
        valid: false,
        error: 'Certificate not found'
      },
      timestamp: '2024-01-18T09:15:00Z'
    }
  ]);

  const getStatusIcon = (valid: boolean) => {
    return valid ? (
      <CheckCircleIcon className="h-5 w-5 text-green-500" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusText = (valid: boolean) => {
    return valid ? 'Verified' : 'Not Found';
  };

  const getStatusColor = (valid: boolean) => {
    return valid ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSearchTypeIcon = (searchType: 'publicId' | 'nationalId') => {
    return searchType === 'publicId' ? (
      <DocumentTextIcon className="h-4 w-4" />
    ) : (
      <UserIcon className="h-4 w-4" />
    );
  };

  const getSearchTypeText = (searchType: 'publicId' | 'nationalId') => {
    return searchType === 'publicId' ? 'Certificate ID' : 'National ID';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <ClockIcon className="h-6 w-6 text-emerald-600 mr-3" />
              Verification History
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track all certificate verifications performed
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Verifications</p>
            <p className="text-2xl font-bold text-emerald-600">{verificationHistory.length}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search verification history..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            <option value="all">All Results</option>
            <option value="verified">Verified Only</option>
            <option value="not-found">Not Found Only</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            <option value="all">All Types</option>
            <option value="publicId">Certificate ID</option>
            <option value="nationalId">National ID</option>
          </select>
        </div>
      </div>

      {/* Verification History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Search Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Certificates Found
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {verificationHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <ClockIcon className="h-8 w-8 text-gray-300 mb-2" />
                      <p>No verification history yet</p>
                      <p className="text-xs mt-1">Perform certificate verifications to see history here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                verificationHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getSearchTypeIcon(item.searchType)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {getSearchTypeText(item.searchType)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {item.searchValue}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.candidateName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(item.result.valid)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.result.valid)}`}>
                          {getStatusText(item.result.valid)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.result.valid ? (
                        item.result.certificates ? (
                          <span className="text-emerald-600 font-medium">
                            {item.result.certificates.length} certificate{item.result.certificates.length !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium">1 certificate</span>
                        )
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDate(item.timestamp)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {verificationHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {verificationHistory.length} of {verificationHistory.length} verifications
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800 rounded-md">1</span>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
