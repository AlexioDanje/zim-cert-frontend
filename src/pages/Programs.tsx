import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { programApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Programs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDegreeLevel, setNewDegreeLevel] = useState<'certificate' | 'diploma' | 'bachelor' | 'master' | 'doctorate'>('bachelor');
  const [newFieldOfStudy, setNewFieldOfStudy] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newCredits, setNewCredits] = useState('');
  const queryClient = useQueryClient();
  const { user, hasPermission } = useAuth();

  const { data: programs, isLoading, error } = useQuery({
    queryKey: ['programs', user?.organizationId],
    queryFn: () => programApi.list(user?.organizationId),
  });

  const createMutation = useMutation({
    mutationFn: () => programApi.create({
      name: newName,
      description: newDescription,
      degreeLevel: newDegreeLevel,
      fieldOfStudy: newFieldOfStudy,
      duration: newDuration,
      credits: newCredits ? parseInt(newCredits) : undefined,
      organizationId: user?.organizationId || 'org-demo',
      isActive: true,
    } as any),
    onSuccess: () => {
      toast.success('Program created successfully');
      queryClient.invalidateQueries({ queryKey: ['programs', user?.organizationId] });
      setShowCreate(false);
      setNewName('');
      setNewDescription('');
      setNewDegreeLevel('bachelor');
      setNewFieldOfStudy('');
      setNewDuration('');
      setNewCredits('');
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || 'Failed to create program');
    },
  });

  const filteredPrograms = programs?.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AcademicCapIcon className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading programs</h3>
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
            Educational Programs
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage educational programs and courses
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {hasPermission('programs:create') ? (
            <button onClick={() => setShowCreate(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Program
            </button>
          ) : (
            <div className="text-sm text-gray-500 italic">
              Contact your administrator to create programs
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Programs Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="text-center py-12">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No programs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first program.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <AcademicCapIcon className="h-5 w-5 text-emerald-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                  </div>
                  
                  {/* Degree Level Badge */}
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      program.degreeLevel === 'doctorate' ? 'bg-purple-100 text-purple-800' :
                      program.degreeLevel === 'master' ? 'bg-blue-100 text-blue-800' :
                      program.degreeLevel === 'bachelor' ? 'bg-green-100 text-green-800' :
                      program.degreeLevel === 'diploma' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {program.degreeLevel === 'doctorate' ? 'Doctorate' :
                       program.degreeLevel === 'master' ? 'Master\'s' :
                       program.degreeLevel === 'bachelor' ? 'Bachelor\'s' :
                       program.degreeLevel === 'diploma' ? 'Diploma' : 'Certificate'}
                    </span>
                  </div>

                  {/* Field of Study */}
                  {program.fieldOfStudy && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Field:</span> {program.fieldOfStudy}
                    </p>
                  )}

                  {/* Duration & Credits */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    {program.duration && (
                      <span>📅 {program.duration}</span>
                    )}
                    {program.credits && (
                      <span>🎓 {program.credits} credits</span>
                    )}
                  </div>

                  {/* Description */}
                  {program.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{program.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Program</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Name *</label>
                <input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="e.g., Advanced Software Engineering Program" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level *</label>
                <select 
                  value={newDegreeLevel} 
                  onChange={(e) => setNewDegreeLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="certificate">Certificate</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="doctorate">Doctorate/PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study *</label>
                <input 
                  value={newFieldOfStudy} 
                  onChange={(e) => setNewFieldOfStudy(e.target.value)} 
                  placeholder="e.g., Computer Science, Engineering, Business" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input 
                    value={newDuration} 
                    onChange={(e) => setNewDuration(e.target.value)} 
                    placeholder="e.g., 4 years, 2 semesters" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                  <input 
                    type="number"
                    value={newCredits} 
                    onChange={(e) => setNewCredits(e.target.value)} 
                    placeholder="120" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={newDescription} 
                  onChange={(e) => setNewDescription(e.target.value)} 
                  placeholder="Brief description of the program..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setShowCreate(false)} disabled={createMutation.isPending} className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button onClick={() => createMutation.mutate()} disabled={!newName || !newFieldOfStudy || createMutation.isPending} className="inline-flex items-center px-4 py-2 text-sm rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
