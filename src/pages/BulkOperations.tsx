import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { bulkApi, templateApi, programApi } from '../services/api';

const bulkIssueSchema = z.object({
  csvData: z.string().min(1, 'CSV data is required'),
  templateId: z.string().min(1, 'Template is required'),
  programId: z.string().min(1, 'Program is required'),
  fieldMapping: z.record(z.string(), z.string()).optional(),
});

type BulkIssueForm = z.infer<typeof bulkIssueSchema>;

export default function BulkOperations() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BulkIssueForm>({
    resolver: zodResolver(bulkIssueSchema),
  });

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templateApi.list(),
  });

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programApi.list(),
  });

  const bulkIssueMutation = useMutation({
    mutationFn: bulkApi.importCsv,
    onSuccess: (data) => {
      toast.success(`Successfully processed ${data.success} certificates!`);
      navigate('/certificates');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Failed to process bulk import');
    },
  });

  const downloadTemplateMutation = useMutation({
    mutationFn: bulkApi.downloadTemplate,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate-template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded successfully!');
    },
    onError: () => {
      toast.error('Failed to download template');
    },
  });

  const handleFileUpload = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
      setValue('csvData', content);
      setShowPreview(true);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const onSubmit = async (data: BulkIssueForm) => {
    try {
      await bulkIssueMutation.mutateAsync({
        organizationId: 'org-demo',
        csvData: data.csvData,
        templateId: data.templateId,
        programId: data.programId,
        fieldMapping: data.fieldMapping || {} as Record<string, string>,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const downloadTemplate = () => {
    downloadTemplateMutation.mutate();
  };

  const csvLines = csvContent.split('\n').filter(line => line.trim());
  const headers = csvLines[0]?.split(',').map(h => h.trim()) || [];
  const previewData = csvLines.slice(1, 6).map(line => 
    line.split(',').map(cell => cell.trim())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Operations</h1>
        <p className="text-lg text-gray-600">
          Import multiple certificates from CSV files
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CloudArrowUpIcon className="h-5 w-5 mr-2 text-emerald-600" />
              Upload CSV File
            </h2>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                dragActive
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600 mb-4">
                <p className="font-medium">Drop your CSV file here</p>
                <p>or click to browse</p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              >
                Choose File
              </label>
            </div>

            {csvFile && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-emerald-800">
                    {csvFile.name} ({Math.round(csvFile.size / 1024)} KB)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Configuration */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2 text-emerald-600" />
                Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="templateId" className="block text-sm font-medium text-gray-700 mb-2">
                    Template *
                  </label>
                  <select
                    id="templateId"
                    {...register('templateId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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

                <div>
                  <label htmlFor="programId" className="block text-sm font-medium text-gray-700 mb-2">
                    Program *
                  </label>
                  <select
                    id="programId"
                    {...register('programId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  type="button"
                  onClick={downloadTemplate}
                  disabled={downloadTemplateMutation.isPending}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  {downloadTemplateMutation.isPending ? 'Downloading...' : 'Download Template'}
                </button>
                <button
                  type="submit"
                  disabled={!csvContent || bulkIssueMutation.isPending}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-white bg-emerald-600 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  {bulkIssueMutation.isPending ? 'Processing...' : 'Process Import'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <InformationCircleIcon className="h-5 w-5 mr-2" />
              Instructions
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>1. Download the CSV template using the button below</p>
              <p>2. Fill in the student data following the template format</p>
              <p>3. Upload the completed CSV file</p>
              <p>4. Select the appropriate template and program</p>
              <p>5. Click "Process Import" to create certificates</p>
            </div>
          </div>

          {/* CSV Preview */}
          {showPreview && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentArrowUpIcon className="h-5 w-5 mr-2 text-emerald-600" />
                CSV Preview
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {headers.map((header, index) => (
                        <th key={index} className="text-left py-2 px-3 font-medium text-gray-700">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-gray-100">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="py-2 px-3 text-gray-600">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Showing first 5 rows of {csvLines.length - 1} data rows
              </p>
            </div>
          )}

          {/* Status */}
          {bulkIssueMutation.isPending && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600 mr-3"></div>
                <span className="text-sm font-medium text-amber-800">
                  Processing certificates... This may take a few minutes.
                </span>
              </div>
            </div>
          )}

          {bulkIssueMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center">
                <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-sm font-medium text-red-800">
                  Error processing certificates. Please check your CSV format and try again.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
