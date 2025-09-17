import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { studentApi } from '../services/api';

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentApi.list(),
  });

  const filteredStudents = students?.filter(student =>
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nationalIdHash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <UserGroupIcon className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading students</h3>
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
            Students
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage student records and information
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students by name, email, or national ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                Import CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new student.'}
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Student
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <li key={student.id}>
                <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <UserGroupIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {student.fullName}
                        </p>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p className="mr-4">{student.email}</p>
                        <p>ID: {student.nationalIdHash?.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stats */}
      {filteredStudents.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Student Statistics</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserGroupIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                        <dd className="text-lg font-medium text-gray-900">{filteredStudents.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-6 w-6 bg-emerald-100 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-emerald-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Students</dt>
                        <dd className="text-lg font-medium text-gray-900">{filteredStudents.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">With Certificates</dt>
                        <dd className="text-lg font-medium text-gray-900">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
