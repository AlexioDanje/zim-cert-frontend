import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  AcademicCapIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface Institution {
  id: string;
  name: string;
  shortName: string;
  type: 'university' | 'college' | 'institute' | 'polytechnic' | 'training_center';
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  contactInfo: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    email: string;
    website?: string;
  };
  registrationNumber: string;
  establishedYear: number;
  accreditationLevel: 'basic' | 'intermediate' | 'advanced' | 'research';
  rectorName: string;
  rectorTitle: string;
  registrarName: string;
  registrarEmail: string;
  organizationId: string;
  isActive: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  lastAuditDate?: string;
  complianceScore?: number;
  certificatesIssued: number;
  createdAtIso: string;
  updatedAtIso?: string;
}

interface InstitutionStats {
  totalInstitutions: number;
  approvedInstitutions: number;
  pendingApplications: number;
  suspendedInstitutions: number;
  institutionsByType: Record<string, number>;
  institutionsByProvince: Record<string, number>;
}

// Mock API functions
const institutionApi = {
  list: async (): Promise<Institution[]> => {
    const response = await api.get('/institutions');
    return response.data;
  },
  
  getStats: async (): Promise<InstitutionStats> => {
    const response = await api.get('/institutions/statistics');
    return response.data;
  },
  
  approve: async (id: string, approvedBy: string): Promise<Institution> => {
    const response = await fetch(`/api/institutions/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvedBy })
    });
    if (!response.ok) throw new Error('Failed to approve institution');
    return response.json();
  },
  
  suspend: async (id: string, reason: string): Promise<Institution> => {
    const response = await fetch(`/api/institutions/${id}/suspend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to suspend institution');
    return response.json();
  },
  
  reject: async (id: string, reason: string): Promise<Institution> => {
    const response = await fetch(`/api/institutions/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to reject institution');
    return response.json();
  },

  create: async (data: Omit<Institution, 'id' | 'createdAtIso' | 'updatedAtIso'>): Promise<Institution> => {
    const response = await api.post('/institutions', data);
    return response.data;
  }
};

export default function InstitutionManagement() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | Institution['status']>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'suspend' | 'reject' | null>(null);
  
  // Create institution form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInstitution, setNewInstitution] = useState({
    name: '',
    shortName: '',
    type: 'university' as Institution['type'],
    registrationNumber: '',
    establishedYear: new Date().getFullYear(),
    accreditationLevel: 'basic' as Institution['accreditationLevel'],
    rectorName: '',
    rectorTitle: '',
    registrarName: '',
    registrarEmail: '',
    organizationId: '',
    contactInfo: {
      address: '',
      city: '',
      province: '',
      postalCode: '',
      phone: '',
      email: '',
      website: ''
    },
    status: 'pending' as Institution['status'],
    isActive: true,
    certificatesIssued: 0
  });
  
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: institutions, isLoading: institutionsLoading } = useQuery({
    queryKey: ['institutions'],
    queryFn: institutionApi.list,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['institution-stats'],
    queryFn: institutionApi.getStats,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, approvedBy }: { id: string; approvedBy: string }) =>
      institutionApi.approve(id, approvedBy),
    onSuccess: () => {
      toast.success('Institution approved successfully');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['institution-stats'] });
      setShowActionModal(false);
      setSelectedInstitution(null);
      setActionReason('');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to approve institution');
    },
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      institutionApi.suspend(id, reason),
    onSuccess: () => {
      toast.success('Institution suspended');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['institution-stats'] });
      setShowActionModal(false);
      setSelectedInstitution(null);
      setActionReason('');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to suspend institution');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      institutionApi.reject(id, reason),
    onSuccess: () => {
      toast.success('Institution rejected');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['institution-stats'] });
      setShowActionModal(false);
      setSelectedInstitution(null);
      setActionReason('');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to reject institution');
    },
  });

  const createMutation = useMutation({
    mutationFn: institutionApi.create,
    onSuccess: () => {
      toast.success('Institution created successfully');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['institution-stats'] });
      setShowCreateModal(false);
      // Reset form
      setNewInstitution({
        name: '',
        shortName: '',
        type: 'university',
        registrationNumber: '',
        establishedYear: new Date().getFullYear(),
        accreditationLevel: 'basic',
        rectorName: '',
        rectorTitle: '',
        registrarName: '',
        registrarEmail: '',
        organizationId: '',
        contactInfo: {
          address: '',
          city: '',
          province: '',
          postalCode: '',
          phone: '',
          email: '',
          website: ''
        },
        status: 'pending',
        isActive: true,
        certificatesIssued: 0
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || 'Failed to create institution');
    },
  });

  const filteredInstitutions = institutions?.filter(inst => 
    selectedStatus === 'all' || inst.status === selectedStatus
  ) || [];

  const getStatusIcon = (status: Institution['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'suspended':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Institution['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (institution: Institution, action: 'approve' | 'suspend' | 'reject') => {
    setSelectedInstitution(institution);
    setPendingAction(action);
    setShowActionModal(true);
  };

  const executeAction = () => {
    if (!selectedInstitution || !pendingAction) return;

    switch (pendingAction) {
      case 'approve':
        approveMutation.mutate({ 
          id: selectedInstitution.id, 
          approvedBy: user?.id || 'ministry-admin' 
        });
        break;
      case 'suspend':
        if (!actionReason.trim()) {
          toast.error('Please provide a reason for suspension');
          return;
        }
        suspendMutation.mutate({ id: selectedInstitution.id, reason: actionReason });
        break;
      case 'reject':
        if (!actionReason.trim()) {
          toast.error('Please provide a reason for rejection');
          return;
        }
        rejectMutation.mutate({ id: selectedInstitution.id, reason: actionReason });
        break;
    }
  };

  const isLoading = institutionsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Institution Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage educational institutions in the national system
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {user?.role === 'ministry_admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Institution
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BuildingOffice2Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Institutions</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalInstitutions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approvedInstitutions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Suspended</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.suspendedInstitutions}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Institutions</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Institutions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Institutions ({filteredInstitutions.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredInstitutions.map((institution) => (
            <div key={institution.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <AcademicCapIcon className="h-6 w-6 text-emerald-600" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      {institution.name}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(institution.status)}`}>
                      {getStatusIcon(institution.status)}
                      <span className="ml-1 capitalize">{institution.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {institution.contactInfo.city}, {institution.contactInfo.province}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        {institution.contactInfo.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        {institution.contactInfo.email}
                      </div>
                      {institution.contactInfo.website && (
                        <div className="flex items-center text-sm text-gray-600">
                          <GlobeAltIcon className="h-4 w-4 mr-2" />
                          <a 
                            href={institution.contactInfo.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            {institution.contactInfo.website}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Type:</span> {institution.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Established:</span> {institution.establishedYear}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Registration:</span> {institution.registrationNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Certificates Issued:</span> {institution.certificatesIssued}
                      </p>
                      {institution.complianceScore && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Compliance Score:</span> {institution.complianceScore}%
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Rector: {institution.rectorName} ({institution.rectorTitle})</span>
                    <span>•</span>
                    <span>Registrar: {institution.registrarName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <button
                    onClick={() => setSelectedInstitution(institution)}
                    className="text-gray-400 hover:text-gray-600"
                    title="View Details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>

                  {institution.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(institution, 'approve')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(institution, 'reject')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </>
                  )}

                  {institution.status === 'approved' && (
                    <button
                      onClick={() => handleAction(institution, 'suspend')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-orange-600 hover:bg-orange-700"
                    >
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredInstitutions.length === 0 && (
            <div className="text-center py-12">
              <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No institutions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedStatus === 'all' 
                  ? 'No institutions have been registered yet.' 
                  : `No institutions with status "${selectedStatus}".`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedInstitution && pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowActionModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {pendingAction === 'approve' ? 'Approve Institution' :
               pendingAction === 'suspend' ? 'Suspend Institution' : 'Reject Institution'}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              {pendingAction === 'approve' 
                ? `Are you sure you want to approve ${selectedInstitution.name}? This will allow them to issue certificates.`
                : `You are about to ${pendingAction} ${selectedInstitution.name}. Please provide a reason:`}
            </p>

            {pendingAction !== 'approve' && (
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Enter reason..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-4"
              />
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                disabled={approveMutation.isPending || suspendMutation.isPending || rejectMutation.isPending}
                className={`px-4 py-2 text-sm rounded-md text-white ${
                  pendingAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  pendingAction === 'suspend' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {approveMutation.isPending || suspendMutation.isPending || rejectMutation.isPending
                  ? 'Processing...' 
                  : `${pendingAction === 'approve' ? 'Approve' : pendingAction === 'suspend' ? 'Suspend' : 'Reject'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Institution Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => !createMutation.isPending && setShowCreateModal(false)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-lg border border-gray-200 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Add New Institution</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
                  <input
                    type="text"
                    value={newInstitution.name}
                    onChange={(e) => setNewInstitution({...newInstitution, name: e.target.value})}
                    placeholder="e.g., University of Technology"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Name *</label>
                  <input
                    type="text"
                    value={newInstitution.shortName}
                    onChange={(e) => setNewInstitution({...newInstitution, shortName: e.target.value})}
                    placeholder="e.g., UoT"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution Type *</label>
                  <select
                    value={newInstitution.type}
                    onChange={(e) => setNewInstitution({...newInstitution, type: e.target.value as Institution['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="university">University</option>
                    <option value="college">College</option>
                    <option value="institute">Institute</option>
                    <option value="polytechnic">Polytechnic</option>
                    <option value="training_center">Training Center</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                  <input
                    type="text"
                    value={newInstitution.registrationNumber}
                    onChange={(e) => setNewInstitution({...newInstitution, registrationNumber: e.target.value})}
                    placeholder="e.g., REG/UNI/001/2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID *</label>
                  <input
                    type="text"
                    value={newInstitution.organizationId}
                    onChange={(e) => setNewInstitution({...newInstitution, organizationId: e.target.value})}
                    placeholder="e.g., org-university"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                  <input
                    type="number"
                    value={newInstitution.establishedYear}
                    onChange={(e) => setNewInstitution({...newInstitution, establishedYear: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation Level</label>
                  <select
                    value={newInstitution.accreditationLevel}
                    onChange={(e) => setNewInstitution({...newInstitution, accreditationLevel: e.target.value as Institution['accreditationLevel']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="research">Research</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b pb-2">Contact Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={newInstitution.contactInfo.address}
                    onChange={(e) => setNewInstitution({
                      ...newInstitution,
                      contactInfo: {...newInstitution.contactInfo, address: e.target.value}
                    })}
                    placeholder="Street address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newInstitution.contactInfo.city}
                      onChange={(e) => setNewInstitution({
                        ...newInstitution,
                        contactInfo: {...newInstitution.contactInfo, city: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <input
                      type="text"
                      value={newInstitution.contactInfo.province}
                      onChange={(e) => setNewInstitution({
                        ...newInstitution,
                        contactInfo: {...newInstitution.contactInfo, province: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={newInstitution.contactInfo.postalCode}
                    onChange={(e) => setNewInstitution({
                      ...newInstitution,
                      contactInfo: {...newInstitution.contactInfo, postalCode: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newInstitution.contactInfo.phone}
                    onChange={(e) => setNewInstitution({
                      ...newInstitution,
                      contactInfo: {...newInstitution.contactInfo, phone: e.target.value}
                    })}
                    placeholder="+263-4-123456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newInstitution.contactInfo.email}
                    onChange={(e) => setNewInstitution({
                      ...newInstitution,
                      contactInfo: {...newInstitution.contactInfo, email: e.target.value}
                    })}
                    placeholder="contact@institution.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={newInstitution.contactInfo.website}
                    onChange={(e) => setNewInstitution({
                      ...newInstitution,
                      contactInfo: {...newInstitution.contactInfo, website: e.target.value}
                    })}
                    placeholder="https://www.institution.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <h4 className="text-md font-medium text-gray-900 border-b pb-2 mt-6">Leadership</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rector Name</label>
                  <input
                    type="text"
                    value={newInstitution.rectorName}
                    onChange={(e) => setNewInstitution({...newInstitution, rectorName: e.target.value})}
                    placeholder="Prof. John Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rector Title</label>
                  <input
                    type="text"
                    value={newInstitution.rectorTitle}
                    onChange={(e) => setNewInstitution({...newInstitution, rectorTitle: e.target.value})}
                    placeholder="Vice-Chancellor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registrar Name</label>
                  <input
                    type="text"
                    value={newInstitution.registrarName}
                    onChange={(e) => setNewInstitution({...newInstitution, registrarName: e.target.value})}
                    placeholder="Dr. Jane Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registrar Email</label>
                  <input
                    type="email"
                    value={newInstitution.registrarEmail}
                    onChange={(e) => setNewInstitution({...newInstitution, registrarEmail: e.target.value})}
                    placeholder="registrar@institution.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={createMutation.isPending}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => createMutation.mutate(newInstitution as any)}
                disabled={!newInstitution.name || !newInstitution.type || !newInstitution.registrationNumber || !newInstitution.organizationId || createMutation.isPending}
                className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Institution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
