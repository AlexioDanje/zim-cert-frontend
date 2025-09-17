import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  AcademicCapIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { certificateApi } from '../services/api';

export default function CertificateDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data: certificate, isLoading, error } = useQuery({
    queryKey: ['certificate', id],
    queryFn: () => certificateApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="text-center py-12">
        <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Certificate not found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The certificate you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link
            to="/certificates"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Certificates
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued':
        return <CheckCircleIcon className="h-6 w-6 text-emerald-600" />;
      case 'revoked':
        return <XCircleIcon className="h-6 w-6 text-red-600" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-amber-600" />;
      default:
        return <DocumentTextIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'issued':
        return `${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400`;
      case 'revoked':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      case 'pending':
        return `${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/certificates"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Certificates
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download
            </button>
            {certificate.status === 'active' && (
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                <TrashIcon className="h-4 w-4 mr-2" />
                Revoke
              </button>
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Certificate Details</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Certificate ID: {certificate.publicId}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Certificate Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-emerald-600" />
              Certificate Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Certificate ID
                </label>
                <p className="text-sm text-gray-900 dark:text-white font-mono">
                  {certificate.publicId}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </label>
                <div className="flex items-center">
                  {getStatusIcon(certificate.status)}
                  <span className={`ml-2 ${getStatusBadge(certificate.status)}`}>
                    {certificate.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Issue Date
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(certificate.createdAtIso).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(certificate.updatedAtIso).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-emerald-600" />
              Student Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Student Name
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {certificate.payload.fields.studentName || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  National ID
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {certificate.payload.fields.nationalId || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {certificate.payload.fields.email || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Phone
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {certificate.payload.fields.phone || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Program Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2 text-emerald-600" />
              Program Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Program Name
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {certificate.payload.fields.programName || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Graduation Year
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {certificate.payload.fields.graduationYear || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Grade/Score
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {certificate.payload.fields.grade || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Duration
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {certificate.payload.fields.duration || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          {Object.keys(certificate.payload.fields).length > 4 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(certificate.payload.fields)
                  .filter(([key]) => !['studentName', 'nationalId', 'programName', 'graduationYear'].includes(key))
                  .map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {String(value) || 'Not provided'}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2 text-emerald-600" />
              Verification Status
            </h3>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Certificate Verified</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This certificate is authentic and valid
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                View Certificate
              </button>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Details
              </button>
            </div>
          </div>

          {/* Certificate Metadata */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Certificate Metadata
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Organization ID:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-mono">
                  {certificate.payload.organizationId}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Student Reference:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {certificate.payload.studentReference}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Template ID:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-mono">
                  {certificate.payload.templateId}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Program ID:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-mono">
                  {certificate.payload.programId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
