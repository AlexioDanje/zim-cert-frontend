import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { 
  ShieldCheckIcon, 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  AcademicCapIcon,
  CreditCardIcon,
  LockClosedIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { verifyApi } from '../services/api';

const verificationSchema = z.object({
  searchMethod: z.enum(['certificate', 'national']),
  certificateId: z.string().optional(),
  nationalId: z.string().optional(),
  organizationId: z.string().optional(),
  paymentAmount: z.number().min(0.01, 'Payment amount must be at least $0.01'),
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'crypto']),
});

type VerificationForm = z.infer<typeof verificationSchema>;

// Mock user account balance
const MOCK_ACCOUNT_BALANCE = 25.50;

export default function Verify() {
  const [verificationParams, setVerificationParams] = useState<{
    searchMethod: 'certificate' | 'national';
    certificateId?: string;
    nationalId?: string;
    organizationId?: string;
  } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      searchMethod: 'certificate',
      organizationId: undefined,
      paymentAmount: 5.00,
      paymentMethod: 'credit_card',
    },
  });

  const searchMethod = watch('searchMethod');
  const paymentAmount = watch('paymentAmount') || 0;
  const hasInsufficientBalance = paymentAmount > MOCK_ACCOUNT_BALANCE;

  // React Query for verification
  const { data: result, isLoading, error } = useQuery({
    queryKey: ['verify', verificationParams],
    queryFn: async () => {
      if (!verificationParams) return null;
      
      if (verificationParams.searchMethod === 'certificate' && verificationParams.certificateId) {
        return await verifyApi.verifyByPublicId(verificationParams.certificateId);
      } else if (verificationParams.searchMethod === 'national' && verificationParams.nationalId) {
        return await verifyApi.verifyByNationalId(verificationParams.nationalId, verificationParams.organizationId || '');
      }
      return null;
    },
    enabled: !!verificationParams,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const onSubmit = async (data: VerificationForm) => {
    if (hasInsufficientBalance) {
      toast.error('Insufficient account balance. Please add funds or reduce the verification amount.');
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process payment (in real app, integrate with payment gateway)
      toast.success(`Payment of $${data.paymentAmount} processed successfully!`);
      
      // Set verification parameters to trigger React Query
      setVerificationParams({
        searchMethod: data.searchMethod,
        certificateId: data.certificateId,
        nationalId: data.nationalId,
        organizationId: data.organizationId,
      });
      
      setShowResult(true);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const resetForm = () => {
    setVerificationParams(null);
    setValue('certificateId', '');
    setValue('nationalId', '');
    setValue('organizationId', undefined as any);
    setShowResult(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-600 mr-3" />
                Certificate Verification
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Verify certificate authenticity with secure payment processing
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Account Balance</div>
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-1" />
                {MOCK_ACCOUNT_BALANCE.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Verification Form */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-indigo-600 mr-2" />
              Verification Request
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Search Method Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Verification Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`relative flex cursor-pointer rounded-xl p-6 border-2 transition-all duration-200 ${
                  searchMethod === 'certificate' 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}>
                  <input
                    type="radio"
                    value="certificate"
                    {...register('searchMethod')}
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <DocumentTextIcon className={`h-6 w-6 mr-3 ${
                        searchMethod === 'certificate' ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className={`font-semibold ${
                          searchMethod === 'certificate' ? 'text-indigo-900' : 'text-gray-900'
                        }`}>
                          Certificate ID
                        </div>
                        <div className={`text-sm ${
                          searchMethod === 'certificate' ? 'text-indigo-600' : 'text-gray-500'
                        }`}>
                          Verify using certificate ID
                        </div>
                      </div>
                    </div>
                    {searchMethod === 'certificate' && (
                      <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                </label>

                <label className={`relative flex cursor-pointer rounded-xl p-6 border-2 transition-all duration-200 ${
                  searchMethod === 'national' 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}>
                  <input
                    type="radio"
                    value="national"
                    {...register('searchMethod')}
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <UserIcon className={`h-6 w-6 mr-3 ${
                        searchMethod === 'national' ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className={`font-semibold ${
                          searchMethod === 'national' ? 'text-indigo-900' : 'text-gray-900'
                        }`}>
                          National ID
                        </div>
                        <div className={`text-sm ${
                          searchMethod === 'national' ? 'text-indigo-600' : 'text-gray-500'
                        }`}>
                          Verify using national ID
                        </div>
                      </div>
                    </div>
                    {searchMethod === 'national' && (
                      <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Search Fields */}
            {searchMethod === 'certificate' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Certificate ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('certificateId', { required: 'Certificate ID is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg placeholder-gray-400"
                    placeholder="Enter certificate ID (e.g., CERT-2024-001)"
                  />
                  <DocumentTextIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.certificateId && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.certificateId.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    National ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('nationalId', { required: 'National ID is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg placeholder-gray-400"
                      placeholder="Enter national ID"
                    />
                    <UserIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.nationalId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.nationalId.message}
                    </p>
                  )}
                </div>
                {/* Organization selection is optional; leave blank for cross-org search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Organization (optional)
                  </label>
                  <div className="relative">
                    <select
                      {...register('organizationId')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg appearance-none bg-white"
                    >
                      <option value="">All organizations</option>
                      <option value="org-demo">Demo University</option>
                      <option value="org-tech">Tech Institute</option>
                      <option value="org-medical">Medical College</option>
                    </select>
                    <BuildingOfficeIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-green-600 mr-2" />
                  Payment Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Verification Fee
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...register('paymentAmount', { 
                          required: 'Payment amount is required',
                          min: { value: 0.01, message: 'Minimum amount is $0.01' }
                        })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.paymentAmount && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.paymentAmount.message}
                      </p>
                    )}
                    {hasInsufficientBalance && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        Insufficient balance. Available: ${MOCK_ACCOUNT_BALANCE.toFixed(2)}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Payment Method
                    </label>
                    <div className="relative">
                      <select
                        {...register('paymentMethod', { required: 'Payment method is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg appearance-none bg-white"
                      >
                        <option value="credit_card">💳 Credit Card</option>
                        <option value="bank_transfer">🏦 Bank Transfer</option>
                        <option value="crypto">₿ Cryptocurrency</option>
                      </select>
                      <BanknotesIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.paymentMethod && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <LockClosedIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <strong>Secure Payment:</strong> Your payment information is encrypted and processed securely. 
                        Verification fees are non-refundable once processing begins.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isProcessingPayment || hasInsufficientBalance}
                className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                  hasInsufficientBalance
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isProcessingPayment
                    ? 'bg-indigo-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Payment...
                  </>
                ) : hasInsufficientBalance ? (
                  <>
                    <ExclamationTriangleIcon className="h-5 w-5 mr-3" />
                    Insufficient Balance
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-5 w-5 mr-3" />
                    Process Payment & Verify
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Verification Results Modal */}
        {showResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowResult(false)}></div>
            <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-indigo-600 mr-2" />
                  Verification Result
                </h3>
                <button onClick={resetForm} className="text-gray-600 hover:text-gray-800">Close</button>
              </div>
              <div
                className="p-6"
                style={{
                  backgroundColor: '#fafaf9',
                  backgroundImage:
                    'radial-gradient(rgba(15,118,110,0.06) 1px, transparent 1px), radial-gradient(rgba(20,184,166,0.06) 1px, transparent 1px), linear-gradient(120deg, rgba(15,118,110,0.04), rgba(20,184,166,0.04))',
                  backgroundPosition: '0 0, 5px 5px, 0 0',
                  backgroundSize: '10px 10px, 10px 10px, 100% 100%'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                    <span className="text-gray-600">Verifying certificate...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <XCircleIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-red-800 font-semibold">Verification Failed</div>
                      <div className="text-red-700 text-sm">{(error as any)?.message || 'An error occurred during verification. Please try again.'}</div>
                    </div>
                  </div>
                ) : result?.valid ? (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-emerald-800 font-semibold">Certificate Verified Successfully</div>
                        <div className="text-emerald-700 text-sm">This certificate is authentic and valid.</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-indigo-600 mr-2" />
                          Certificate Information
                        </h5>
                        <dl className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
                            <dd className="text-sm font-bold text-gray-900">{result?.certificate?.id}</dd>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <dt className="text-sm font-medium text-gray-500">Public ID</dt>
                            <dd className="text-sm font-mono text-gray-900">{result?.certificate?.publicUrlId}</dd>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <dt className="text-sm font-medium text-gray-500">Issuing Institution</dt>
                            <dd className="text-sm font-bold text-gray-900">{result?.certificate?.organizationId}</dd>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                            <dd className="text-sm font-bold text-gray-900">{result?.certificate?.createdAtIso ? new Date(result.certificate.createdAtIso).toLocaleDateString() : '-'}</dd>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">{result?.certificate?.status}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <UserIcon className="h-5 w-5 text-indigo-600 mr-2" />
                          Student Information
                        </h5>
                        <dl className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <dt className="text-sm font-medium text-gray-500">Student Name</dt>
                            <dd className="text-sm font-bold text-gray-900">{result?.certificate?.payload?.fields?.studentName || '-'}</dd>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <dt className="text-sm font-medium text-gray-500">Program</dt>
                            <dd className="text-sm font-bold text-gray-900">{result?.certificate?.payload?.fields?.programName || '-'}</dd>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <dt className="text-sm font-medium text-gray-500">Graduation Year</dt>
                            <dd className="text-sm font-bold text-gray-900">{result?.certificate?.payload?.fields?.graduationYear || '-'}</dd>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <dt className="text-sm font-medium text-gray-500">Grade</dt>
                            <dd className="text-sm font-bold text-gray-900">{result?.certificate?.payload?.fields?.grade || '-'}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <XCircleIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-red-800 font-semibold">Certificate Not Found</div>
                      <div className="text-red-700 text-sm">{(result as any)?.error || 'The certificate could not be verified. Please check the ID and try again.'}</div>
                    </div>
                  </div>
                )}
              </div>
              {/* Footer intentionally removed; Close button handles reset */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
