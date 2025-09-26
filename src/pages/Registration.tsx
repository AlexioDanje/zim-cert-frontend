import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { api, institutionApi } from '../services/api';
import { FormField } from '../components/forms/FormField';
import { AddressForm } from '../components/forms/AddressForm';
import { REGISTRATION_ICONS } from '../components/RegistrationIcons';
import {
  UserType,
  REGISTRATION_CONFIGS,
  studentSchema,
  institutionSchema,
  employerSchemaWithIntent as employerSchema,
  StudentRegistrationData,
  InstitutionRegistrationData,
  EmployerRegistrationData,
} from '../types/registration';

type RegistrationData = StudentRegistrationData | InstitutionRegistrationData | EmployerRegistrationData;

export default function Registration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = (searchParams.get('type') as UserType) || 'student';

  // Fetch institutions for student registration
  const { data: institutions } = useQuery({
    queryKey: ['institutions'],
    queryFn: () => institutionApi.list(),
    enabled: userType === 'student',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Get the appropriate schema based on user type
  const getSchema = () => {
    switch (userType) {
      case 'student':
        return studentSchema;
      case 'institution':
        return institutionSchema;
      case 'employer':
        return employerSchema;
      default:
        return studentSchema;
    }
  };

  const config = REGISTRATION_CONFIGS[userType];
  const IconComponent = REGISTRATION_ICONS[config.iconName as keyof typeof REGISTRATION_ICONS];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegistrationData>({
    resolver: zodResolver(getSchema()),
  });

  // Set userType in form data
  useEffect(() => {
    setValue('userType' as any, userType);
  }, [userType, setValue]);

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Transform data based on user type
      let requestData: any;
      
      switch (userType) {
        case 'student':
          requestData = {
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            nationalId: (data as StudentRegistrationData).nationalId,
            phone: (data as StudentRegistrationData).phone,
            dateOfBirth: (data as StudentRegistrationData).dateOfBirth,
            institutionId: (data as StudentRegistrationData).institutionId,
          };
          break;
          
        case 'institution':
          const instData = data as InstitutionRegistrationData;
          requestData = {
            name: instData.name,
            type: instData.type,
            registrationNumber: instData.registrationNumber,
            contactEmail: instData.contactEmail,
            contactPhone: instData.contactPhone,
            address: instData.address,
            adminEmail: instData.email,
            adminPassword: instData.password,
            adminFullName: instData.fullName,
          };
          break;
          
        case 'employer':
          const empData = data as EmployerRegistrationData;
          requestData = {
            companyName: empData.companyName,
            companyType: empData.companyType,
            registrationNumber: empData.registrationNumber,
            contactPerson: empData.contactPerson,
            phone: empData.phone,
            address: empData.address,
            email: empData.email,
            password: empData.password,
            fullName: empData.fullName,
          };
          break;
      }

      const response = await api.post(config.endpoint, requestData);

      if (response.data.success) {
        setSubmitStatus('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        throw new Error(response.data.error?.message || response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(
        error.response?.data?.error?.message || 
        error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {config.successMessage}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You will be redirected to the login page in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-700 dark:to-gray-800 px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {config.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {config.description}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* User Account Section */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <UserIcon className="w-5 h-5 text-emerald-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
                register={register}
                error={errors.fullName}
              />

              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="user@example.com"
                required
                register={register}
                error={errors.email}
                icon={EnvelopeIcon}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
                register={register}
                error={errors.password}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                required
                register={register}
                error={errors.confirmPassword}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>

          {/* User Type Specific Fields */}
          {userType === 'student' && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <UserIcon className="w-5 h-5 text-emerald-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Student Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="National ID"
                  name="nationalId"
                  type="text"
                  placeholder="48-123456-A78"
                  required
                  register={register}
                  error={(errors as any).nationalId}
                />

                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+263-77-123-4567"
                  register={register}
                  error={(errors as any).phone}
                  icon={PhoneIcon}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  register={register}
                  error={(errors as any).dateOfBirth}
                />

                <FormField
                  label="Institution"
                  required
                  name="institutionId"
                  type="select"
                  register={register}
                  error={(errors as any).institutionId}
                  options={[
                    { value: '', label: 'Select an institution...' },
                    ...(institutions?.map(inst => ({
                      value: inst.id,
                      label: `${inst.name} (${inst.shortName})`
                    })) || [])
                  ]}
                />
              </div>
            </div>
          )}

          {userType === 'institution' && (
            <>
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <UserIcon className="w-5 h-5 text-emerald-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Institution Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Institution Name"
                    name="name"
                    type="text"
                    placeholder="University of Zimbabwe"
                    required
                    register={register}
                    error={(errors as any).name}
                  />

                  <FormField
                    label="Institution Type"
                    name="type"
                    type="select"
                    required
                    register={register}
                    error={(errors as any).type}
                    options={[
                      { value: 'university', label: 'University' },
                      { value: 'college', label: 'College' },
                      { value: 'institute', label: 'Institute' },
                      { value: 'school', label: 'School' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Registration Number"
                    name="registrationNumber"
                    type="text"
                    placeholder="REG-2024-001"
                    required
                    register={register}
                    error={(errors as any).registrationNumber}
                  />

                  <FormField
                    label="Contact Phone"
                    name="contactPhone"
                    type="tel"
                    placeholder="+263-77-123-4567"
                    required
                    register={register}
                    error={(errors as any).contactPhone}
                    icon={PhoneIcon}
                  />
                </div>

                <FormField
                  label="Contact Email"
                  name="contactEmail"
                  type="email"
                  placeholder="admin@university.edu"
                  required
                  register={register}
                  error={(errors as any).contactEmail}
                  icon={EnvelopeIcon}
                />
              </div>

              <AddressForm register={register} errors={errors} prefix="address" />
            </>
          )}

          {userType === 'employer' && (
            <>
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <UserIcon className="w-5 h-5 text-emerald-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Company Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Company Name (optional)"
                    name="companyName"
                    type="text"
                    placeholder="Tech Solutions Ltd"
                    register={register}
                    error={(errors as any).companyName}
                  />

                  <FormField
                    label="Company Type (optional)"
                    name="companyType"
                    type="select"
                    register={register}
                    error={(errors as any).companyType}
                    options={[
                      { value: 'corporation', label: 'Corporation' },
                      { value: 'government', label: 'Government' },
                      { value: 'ngo', label: 'NGO' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Registration Number (optional)"
                    name="registrationNumber"
                    type="text"
                    placeholder="REG-2024-001"
                    register={register}
                    error={(errors as any).registrationNumber}
                  />

                  <FormField
                    label="Contact Person (optional)"
                    name="contactPerson"
                    type="text"
                    placeholder="John Doe"
                    register={register}
                    error={(errors as any).contactPerson}
                  />
                </div>

                <FormField
                  label="Phone Number (optional)"
                  name="phone"
                  type="tel"
                  placeholder="+263-77-123-4567"
                  register={register}
                  error={(errors as any).phone}
                  icon={PhoneIcon}
                />
              </div>

              <AddressForm register={register} errors={errors} prefix="address" />
            </>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
              <XCircleIcon className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              Back to Login
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                `Create ${config.title.split(' ')[0]} Account`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
