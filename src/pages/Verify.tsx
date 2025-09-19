import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useSearchParams } from 'react-router-dom';
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
  BanknotesIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { verifyApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const verificationSchema = z.object({
  searchMethod: z.enum(['certificate', 'national']),
  certificateId: z.string().optional(),
  nationalId: z.string().optional(),
  paymentAmount: z.number().min(0.01, 'Payment amount must be at least $0.01'),
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'crypto']),
});

type VerificationForm = z.infer<typeof verificationSchema>;

// Mock user account balance
const MOCK_ACCOUNT_BALANCE = 25.50;

export default function Verify() {
  const { user } = useAuth();
  const { publicId } = useParams<{ publicId: string }>();
  const [searchParams] = useSearchParams();
  const [verificationParams, setVerificationParams] = useState<{
    searchMethod: 'certificate' | 'national';
    certificateId?: string;
    nationalId?: string;
  } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isQrVerification, setIsQrVerification] = useState(false);
  const [currentCertificatePage, setCurrentCertificatePage] = useState(1);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      searchMethod: 'certificate',
      paymentAmount: 5.00,
      paymentMethod: 'credit_card',
    },
  });

  const searchMethod = watch('searchMethod');
  const paymentAmount = watch('paymentAmount') || 0;
  const hasInsufficientBalance = paymentAmount > MOCK_ACCOUNT_BALANCE;

  // Handle QR code verification automatically
  useEffect(() => {
    if (publicId) {
      setIsQrVerification(true);
      setVerificationParams({
        searchMethod: 'certificate',
        certificateId: publicId,
      });
      setShowResult(true);
    }
  }, [publicId]);

  // React Query for verification
  const { data: result, isLoading, error } = useQuery({
    queryKey: ['verify', verificationParams],
    queryFn: async () => {
      if (!verificationParams) {
        console.log('🔍 No verification params, returning null');
        return null;
      }
      
      console.log('🔍 Verification params:', verificationParams);
      
      if (verificationParams.searchMethod === 'certificate' && verificationParams.certificateId) {
        console.log('🔍 Verifying by certificate ID:', verificationParams.certificateId);
        const result = await verifyApi.verifyByPublicId(verificationParams.certificateId);
        console.log('🔍 Certificate verification result:', result);
        return result;
      } else if (verificationParams.searchMethod === 'national' && verificationParams.nationalId) {
        console.log('🔍 Verifying by national ID:', verificationParams.nationalId);
        const result = await verifyApi.verifyByNationalId(verificationParams.nationalId);
        console.log('🔍 National ID verification result:', result);
        return result;
      }
      console.log('🔍 No matching verification method, returning null');
      return null;
    },
    enabled: !!verificationParams,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Pagination logic for certificates
  const certificatesPerPage = 1;
  const allCertificates = result?.certificates || (result?.certificate ? [result.certificate] : []);
  const totalPages = Math.max(1, allCertificates.length);
  const currentCertificate = allCertificates[currentCertificatePage - 1];
  
  // Reset to first page when new verification results come in
  useEffect(() => {
    if (result?.valid && allCertificates.length > 0) {
      setCurrentCertificatePage(1);
    }
  }, [result?.valid, allCertificates.length]);

  // Debug logging (can be removed in production)
  // console.log('🔍 Verification result:', result);
  // console.log('🔍 All certificates:', allCertificates);
  // console.log('🔍 Current page:', currentCertificatePage);
  // console.log('🔍 Total pages:', totalPages);

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
                <ShieldCheckIcon className="h-8 w-8 text-emerald-600 mr-3" />
                {isQrVerification ? 'Certificate Verification' : 'Certificate Verification'}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {isQrVerification 
                  ? 'Verifying certificate authenticity from QR code scan'
                  : 'Verify certificate authenticity with secure payment processing'
                }
              </p>
            </div>
            {!isQrVerification && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Account Balance</div>
                <div className="text-2xl font-bold text-gray-900 flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-1" />
                  {MOCK_ACCOUNT_BALANCE.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Verification Form - Hidden for QR verification */}
        {!isQrVerification && (
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-emerald-600 mr-2" />
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
                    ? 'border-emerald-500 bg-emerald-50 shadow-md' 
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
                        searchMethod === 'certificate' ? 'text-emerald-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className={`font-semibold ${
                          searchMethod === 'certificate' ? 'text-emerald-900' : 'text-gray-900'
                        }`}>
                          Certificate ID
                        </div>
                        <div className={`text-sm ${
                          searchMethod === 'certificate' ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          Verify using certificate ID
                        </div>
                      </div>
                    </div>
                    {searchMethod === 'certificate' && (
                      <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                </label>

                <label className={`relative flex cursor-pointer rounded-xl p-6 border-2 transition-all duration-200 ${
                  searchMethod === 'national' 
                    ? 'border-emerald-500 bg-emerald-50 shadow-md' 
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
                        searchMethod === 'national' ? 'text-emerald-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className={`font-semibold ${
                          searchMethod === 'national' ? 'text-emerald-900' : 'text-gray-900'
                        }`}>
                          National ID
                        </div>
                        <div className={`text-sm ${
                          searchMethod === 'national' ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          Verify using national ID
                        </div>
                      </div>
                    </div>
                    {searchMethod === 'national' && (
                      <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-gray-400"
                    placeholder="Enter certificate ID (e.g., CERT-2024-001)"
                  />
                  <DocumentTextIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                {errors.certificateId && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.certificateId.message}
                  </p>
                )}
              </div>
            ) : (
              <div >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    National ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('nationalId', { required: 'National ID is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-gray-400"
                      placeholder="Enter national ID (e.g., 48-12334...)"
                    />
                    <UserIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.nationalId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.nationalId.message}
                    </p>
                  )}
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
                    ? 'bg-emerald-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
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
        )}

        {/* QR Code Verification Direct Result */}
        {isQrVerification && (
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-emerald-600 mr-2" />
                QR Code Verification Result
              </h2>
              <p className="text-sm text-gray-600 mt-1">Certificate ID: {publicId}</p>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mr-3"></div>
                  <span className="text-gray-600 text-lg">Verifying certificate authenticity...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <XCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-red-800 font-semibold text-lg">Verification Failed</div>
                    <div className="text-red-700 mt-1">{(error as any)?.message || 'An error occurred during verification. Please try again.'}</div>
                  </div>
                </div>
              ) : result?.valid ? (
                <div className="space-y-6">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-start">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="text-emerald-800 font-semibold text-xl">✅ Certificate Verified Successfully</div>
                      <div className="text-emerald-700 mt-1">
                        {result?.certificates && result.certificates.length > 1 
                          ? `Found ${result.certificates.length} certificates for this National ID.`
                          : 'This certificate is authentic and valid.'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Multiple Certificates Summary */}
                  {result?.certificates && result.certificates.length > 1 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <DocumentTextIcon className="w-6 h-6 text-emerald-600 mr-3" />
                        <h3 className="text-lg font-semibold text-emerald-900">All Certificates for this National ID</h3>
                      </div>
                      <div className="grid gap-4">
                        {result.certificates.map((cert, index) => (
                          <div key={cert.id} className="bg-white rounded-lg p-4 border border-emerald-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                    #{index + 1}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {cert.payload?.fields?.certificateType || 'Certificate'}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {cert.payload?.fields?.graduationYear || new Date(cert.createdAtIso).getFullYear()}
                                  </span>
                                </div>
                                <div className="mt-1 text-sm text-gray-600">
                                  <strong>{cert.payload?.fields?.studentName}</strong> - {cert.payload?.fields?.programName}
                                  {cert.payload?.fields?.grade && (
                                    <span className="ml-2 text-blue-600 font-medium">Grade: {cert.payload.fields.grade}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                  cert.status === 'issued' ? 'bg-green-100 text-green-800' : 
                                  cert.status === 'revoked' ? 'bg-red-100 text-red-800' : 
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {cert.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificate Preview */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl border border-blue-200 dark:border-gray-600 p-8">
                    <div className="flex items-center mb-6">
                      <DocumentTextIcon className="w-6 h-6 text-blue-600 mr-3" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verified Certificate</h2>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-blue-300 dark:border-gray-500">
                      <div className="text-center space-y-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {result?.certificate?.payload?.fields?.certificateType || 'Certificate'}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                          {result?.certificate?.payload?.fields?.badgeText || result?.certificate?.payload?.fields?.certificateType || 'Certificate'}
                        </h3>
                        
                        <div className="max-w-md mx-auto">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            This is to certify that <strong>{result?.certificate?.payload?.fields?.studentName || '[Student Name]'}</strong> {result?.certificate?.payload?.fields?.completionText || 'has successfully completed'} <strong>{result?.certificate?.payload?.fields?.programName || '[Program Name]'}</strong>
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Type:</span>
                            <div className="font-medium text-gray-900 dark:text-white">{result?.certificate?.payload?.fields?.certificateType || 'Certificate'}</div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Institution:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {(result?.certificate as any)?.templateSnapshot?.branding?.issuerName || 'ZIM Institute of Technology'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Issue Date:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {result?.certificate?.createdAtIso ? new Date(result.certificate.createdAtIso).toLocaleDateString() : '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                        ✨ This certificate has been cryptographically verified and is authentic
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-emerald-600 mr-2" />
                        Certificate Information
                      </h5>
                      <dl className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
                          <dd className="text-sm font-mono text-gray-900">{result?.certificate?.id?.substring(0, 12)}...</dd>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <dt className="text-sm font-medium text-gray-500">Institution</dt>
                          <dd className="text-sm font-bold text-gray-900">ZIM Institute of Technology</dd>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                          <dd className="text-sm font-bold text-gray-900">{result?.certificate?.createdAtIso ? new Date(result.certificate.createdAtIso).toLocaleDateString() : '-'}</dd>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            {result?.certificate?.status}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 text-emerald-600 mr-2" />
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
                          <dt className="text-sm font-medium text-gray-500">Classification</dt>
                          <dd className="text-sm font-bold text-gray-900">{result?.certificate?.payload?.fields?.classification || '-'}</dd>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <dt className="text-sm font-medium text-gray-500">Reference</dt>
                          <dd className="text-sm font-bold text-gray-900">{result?.certificate?.payload?.studentReference || '-'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <XCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-red-800 font-semibold text-lg">Certificate Not Found</div>
                    <div className="text-red-700 mt-1">The certificate could not be verified. It may have been revoked or the ID is invalid.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification Results Modal - Only for manual verification */}
        {showResult && !isQrVerification && (
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
                ) : result?.valid === true ? (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-emerald-800 font-semibold">
                          {result?.certificates?.length > 1 
                            ? `Found ${result.certificates.length} Certificates` 
                            : 'Certificate Verified Successfully'
                          }
                        </div>
                        <div className="text-emerald-700 text-sm">
                          {result?.certificates?.length > 1 
                            ? 'Multiple certificates found for this national ID'
                            : 'This certificate is authentic and valid.'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Display current certificate with pagination */}
                    {currentCertificate && (
                      <div className="space-y-6">
                        {/* Certificate Card */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                              <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <DocumentTextIcon className="h-5 w-5 text-emerald-600 mr-2" />
                                Certificate Information
                              </h5>
                              <dl className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                  <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
                                  <dd className="text-sm font-bold text-gray-900">{currentCertificate.id}</dd>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                  <dt className="text-sm font-medium text-gray-500">Public ID</dt>
                                  <dd className="text-sm font-mono text-gray-900">{currentCertificate.publicUrlId}</dd>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                  <dt className="text-sm font-medium text-gray-500">Issuing Institution</dt>
                                  <dd className="text-sm font-bold text-gray-900">{currentCertificate.organizationId}</dd>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                                  <dd className="text-sm font-bold text-gray-900">{currentCertificate.createdAtIso ? new Date(currentCertificate.createdAtIso).toLocaleDateString() : '-'}</dd>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                                  <dd className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">{currentCertificate.status}</dd>
                                </div>
                              </dl>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                              <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <UserIcon className="h-5 w-5 text-emerald-600 mr-2" />
                                Student Information
                              </h5>
                              <dl className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                  <dt className="text-sm font-medium text-gray-500">Student Name</dt>
                                  <dd className="text-sm font-bold text-gray-900">{currentCertificate.payload?.fields?.studentName || '-'}</dd>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                  <dt className="text-sm font-medium text-gray-500">Program</dt>
                                  <dd className="text-sm font-bold text-gray-900">{currentCertificate.payload?.fields?.programName || '-'}</dd>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                  <dt className="text-sm font-medium text-gray-500">Graduation Year</dt>
                                  <dd className="text-sm font-bold text-gray-900">{currentCertificate.payload?.fields?.graduationYear || '-'}</dd>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <dt className="text-sm font-medium text-gray-500">Grade</dt>
                                  <dd className="text-sm font-bold text-gray-900">{currentCertificate.payload?.fields?.grade || '-'}</dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setCurrentCertificatePage(Math.max(1, currentCertificatePage - 1))}
                                disabled={currentCertificatePage === 1}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                                Previous
                              </button>
                              <button
                                onClick={() => setCurrentCertificatePage(Math.min(totalPages, currentCertificatePage + 1))}
                                disabled={currentCertificatePage === totalPages}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                                <ChevronRightIcon className="h-4 w-4 ml-1" />
                              </button>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-700">
                                Certificate {currentCertificatePage} of {totalPages}
                              </span>
                              <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => (
                                  <button
                                    key={i + 1}
                                    onClick={() => setCurrentCertificatePage(i + 1)}
                                    className={`w-8 h-8 rounded-full text-sm font-medium ${
                                      currentCertificatePage === i + 1
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
