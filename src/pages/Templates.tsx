import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { templateApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templateApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: () => templateApi.create({
      name: newName,
      organizationId: user?.organizationId || 'org-demo',
      fieldsSchema: {},
      pdfLayout: { includeRibbonBadge: false, showSealNearSignature: true },
      branding: { primaryColorHex: '#0F766E', secondaryColorHex: '#14B8A6' },
      typography: { titleSize: 32, nameSize: 24, bodySize: 12 },
    } as any),
    onSuccess: () => {
      toast.success('Template created');
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setShowCreate(false);
      setNewName('');
      setNewDescription('');
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || 'Failed to create template');
    },
  });

  const filteredTemplates = templates?.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <DocumentTextIcon className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading templates</h3>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Certificate Templates
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage certificate templates and designs
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button onClick={() => setShowCreate(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first template.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Template</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Created: {template.createdAtIso ? new Date(template.createdAtIso).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="text-gray-400 hover:text-gray-600" title="View">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600" title="Edit">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="text-red-400 hover:text-red-600" title="Delete">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => !createMutation.isPending && setShowCreate(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., Degree Certificate" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={3} placeholder="Short description" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setShowCreate(false)} disabled={createMutation.isPending} className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button onClick={() => createMutation.mutate()} disabled={!newName || createMutation.isPending} className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
