import { Link } from 'react-router-dom';
import { DocumentTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { Certificate } from '../types';

interface RecentActivityProps {
  certificates: Certificate[];
}

const statusIcons = {
  issued: CheckCircleIcon,
  revoked: XCircleIcon,
  pending: ClockIcon,
};

const statusColors = {
  issued: {
    text: 'text-emerald-600',
    bg: 'bg-emerald-100',
    ring: 'ring-emerald-200',
  },
  revoked: {
    text: 'text-red-600',
    bg: 'bg-red-100',
    ring: 'ring-red-200',
  },
  pending: {
    text: 'text-amber-600',
    bg: 'bg-amber-100',
    ring: 'ring-amber-200',
  },
};

export default function RecentActivity({ certificates }: RecentActivityProps) {
  if (certificates.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <DocumentTextIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">No certificates</h3>
        <p className="text-sm text-gray-500">Get started by issuing your first certificate.</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {certificates.map((certificate, index) => {
          const StatusIcon = statusIcons[certificate.status];
          const statusColor = statusColors[certificate.status];
          
          return (
            <li key={certificate.id}>
              <div className="relative pb-8">
                {index !== certificates.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${statusColor.bg} ${statusColor.text}`}>
                      <StatusIcon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Certificate <span className="font-semibold text-gray-900">{certificate.payload.studentReference}</span> was 
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                          {certificate.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Student: {certificate.payload.fields.studentName || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={certificate.createdAtIso} className="font-medium">
                        {new Date(certificate.createdAtIso).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
