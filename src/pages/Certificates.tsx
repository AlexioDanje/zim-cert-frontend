import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { certificateApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Certificate, SearchFilters } from '../types';

export default function Certificates() {
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'issued' | 'revoked' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const searchFilters: SearchFilters = {
    organizationId: user?.organizationId,
    query: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page: currentPage,
    limit: pageSize,
  };

  const { data: searchResult, isLoading, error } = useQuery({
    queryKey: ['certificates-search', user?.organizationId, searchFilters],
    queryFn: () => certificateApi.search(searchFilters),
  });

  const certificates = searchResult?.items || [];
  const totalPages = Math.ceil((searchResult?.total || 0) / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const downloadPdf = async (certificateId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      const response = await fetch(`${apiUrl}/certificates/${certificateId}/pdf`);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const previewPdf = (certificateId: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    const url = `${apiUrl}/certificates/${certificateId}/preview`;
    window.open(url, '_blank');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued':
        return <CheckCircleIcon className="h-5 w-5 text-emerald-600" />;
      case 'revoked':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-amber-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'issued':
        return `${baseClasses} bg-emerald-100 text-emerald-800`;
      case 'revoked':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading certificates</h3>
        <p className="mt-1 text-sm text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Certificates
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all issued certificates
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          {hasPermission('bulk:create') && (
            <Link
              to="/bulk"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              Bulk Import
            </Link>
          )}
          {hasPermission('certificates:create') && (
            <Link
              to="/issue"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Issue Certificate
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search certificates by student name, ID, or program..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Status</option>
                  <option value="issued">Issued</option>
                  <option value="revoked">Revoked</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by issuing your first certificate.'}
            </p>
            {!searchTerm && hasPermission('certificates:create') && (
              <div className="mt-6">
                <Link
                  to="/issue"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Issue Certificate
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certificate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {certificates.map((certificate) => (
                    <tr key={certificate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                              {getStatusIcon(certificate.status)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {certificate.payload.studentReference}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <span>Public ID:</span>
                              <span className="font-mono break-all">{certificate.publicUrlId}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {certificate.payload.fields.studentName || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {certificate.payload.fields.nationalId || 'No ID'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {certificate.payload.fields.programName || 'Unknown Program'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {certificate.payload.fields.graduationYear || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(certificate.status)}>
                          {certificate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(certificate.createdAtIso).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/certificates/${certificate.id}`}
                            className="text-emerald-600 hover:text-emerald-900"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadPdf(certificate.id)}
                            className="text-emerald-600 hover:text-emerald-900"
                            title="Download PDF"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => previewPdf(certificate.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Preview PDF"
                          >
                            <DocumentTextIcon className="h-4 w-4" />
                          </button>
                          {certificate.status === 'issued' && (
                            <button
                              className="text-red-400 hover:text-red-600"
                              title="Revoke"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, searchResult?.total || 0)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{searchResult?.total || 0}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
