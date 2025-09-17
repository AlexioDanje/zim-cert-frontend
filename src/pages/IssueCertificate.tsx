import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  DocumentTextIcon,
  UserIcon,
  AcademicCapIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  SparklesIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { certificateApi, programApi, templateApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const issueCertificateSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  nationalId: z.string().min(1, 'National ID is required'),
  programId: z.string().min(1, 'Program is required'),
  templateId: z.string().min(1, 'Template is required'),
  graduationYear: z.string().min(4, 'Graduation year is required'),
  grade: z.string().optional(),
  additionalFields: z.record(z.string(), z.string()).optional(),
});

type IssueCertificateForm = z.infer<typeof issueCertificateSchema>;

export default function IssueCertificate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalFields, setAdditionalFields] = useState<Array<{ key: string; value: string }>>([]);
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<IssueCertificateForm>({
    resolver: zodResolver(issueCertificateSchema),
  });

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programApi.list(),
  });

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templateApi.list(),
  });

  const issueMutation = useMutation({
    mutationFn: certificateApi.issue,
    onSuccess: (data) => {
      toast.success('Certificate issued successfully!');
      navigate('/certificates');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to issue certificate');
    },
  });

  const onSubmit = async (data: IssueCertificateForm) => {
    setIsSubmitting(true);
    try {
      const additionalFieldsObj = additionalFields.reduce((acc, field) => {
        if (field.key && field.value) {
          acc[field.key] = field.value;
        }
        return acc;
      }, {} as Record<string, string>);

      // Backend expects: organizationId, studentId, programId, templateId, issueDateIso, fields, studentReference
      const selectedProgramName = programs?.find(p => p.id === data.programId)?.name || '';
      const issueData = {
        organizationId: user?.organizationId || 'org-demo',
        studentId: data.nationalId,
        programId: data.programId,
        templateId: data.templateId,
        issueDateIso: new Date().toISOString(),
        studentReference: data.nationalId,
        fields: {
          studentName: data.studentName,
          nationalId: data.nationalId,
          programName: selectedProgramName,
          graduationYear: data.graduationYear,
          grade: data.grade || '',
          ...additionalFieldsObj,
        } as Record<string, string>,
      };

      await issueMutation.mutateAsync(issueData as any);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAdditionalField = () => {
    setAdditionalFields([...additionalFields, { key: '', value: '' }]);
  };

  const removeAdditionalField = (index: number) => {
    setAdditionalFields(additionalFields.filter((_, i) => i !== index));
  };

  const updateAdditionalField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...additionalFields];
    updated[index][field] = value;
    setAdditionalFields(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
              <DocumentTextIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Issue Certificate</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                Create a new digital certificate for a student
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Student Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <UserIcon className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="studentName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Student Name *
                </label>
                <input
                  {...register('studentName')}
                  type="text"
                  id="studentName"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  placeholder="Enter student's full name"
                />
                {errors.studentName && (
                  <p className="mt-1 text-sm text-red-600">{errors.studentName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="nationalId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  National ID *
                </label>
                <input
                  {...register('nationalId')}
                  type="text"
                  id="nationalId"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  placeholder="Enter national identification number"
                />
                {errors.nationalId && (
                  <p className="mt-1 text-sm text-red-600">{errors.nationalId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="programId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Program *
                </label>
                <select
                  {...register('programId')}
                  id="programId"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a program</option>
                  {programs?.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
                {errors.programId && (
                  <p className="mt-1 text-sm text-red-600">{errors.programId.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="graduationYear" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Graduation Year *
                </label>
                <input
                  {...register('graduationYear')}
                  type="number"
                  id="graduationYear"
                  min="2000"
                  max="2030"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  placeholder="2024"
                />
                {errors.graduationYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.graduationYear.message}</p>
                )}
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Grade (Optional)
              </label>
              <input
                {...register('grade')}
                type="text"
                id="grade"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
                placeholder="A+, 95%, Distinction, etc."
              />
            </div>
          </div>

          {/* Certificate Template */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <DocumentTextIcon className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Certificate Template</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="templateId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Template *
                </label>
                <select
                  {...register('templateId')}
                  id="templateId"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a template</option>
                  {templates?.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {errors.templateId && (
                  <p className="mt-1 text-sm text-red-600">{errors.templateId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <SparklesIcon className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Additional Fields</h2>
              </div>
              <button
                type="button"
                onClick={addAdditionalField}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Field
              </button>
            </div>
            <div className="space-y-4">
              {additionalFields.map((field, index) => (
                <div key={index} className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Field name"
                    value={field.key}
                    onChange={(e) => updateAdditionalField(index, 'key', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Field value"
                    value={field.value}
                    onChange={(e) => updateAdditionalField(index, 'value', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalField(index)}
                    className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {additionalFields.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No additional fields added yet</p>
                  <p className="text-sm">Click "Add Field" to include custom information</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Issuing Certificate...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Issue Certificate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
