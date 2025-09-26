import { z } from 'zod';

// Base user account fields (common to all user types) - without refine
const baseUserFields = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(1, 'Full name is required'),
};

// Base schemas without refine (for discriminated union)
const baseStudentSchema = z.object({
  ...baseUserFields,
  nationalId: z.string().min(1, 'National ID is required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  institutionId: z.string().min(1, 'Institution is required'),
});

const baseInstitutionSchema = z.object({
  ...baseUserFields,
  name: z.string().min(1, 'Institution name is required'),
  type: z.enum(['university', 'college', 'institute', 'school'], {
    required_error: 'Institution type is required',
  }),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
});

const baseEmployerSchema = z.object({
  ...baseUserFields,
  // Make all organization fields optional to support companies or individuals
  companyName: z.string().optional(),
  companyType: z.enum(['corporation', 'government', 'ngo', 'other']).optional(),
  registrationNumber: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

// Union type for all registration schemas
export const registrationSchema = z.discriminatedUnion('userType', [
  baseStudentSchema.extend({ userType: z.literal('student') }),
  baseInstitutionSchema.extend({ userType: z.literal('institution') }),
  baseEmployerSchema.extend({ userType: z.literal('employer') }),
]);

// Individual schemas with refine for form validation
export const studentSchema = baseStudentSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const institutionSchema = baseInstitutionSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const employerSchema = baseEmployerSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
// Additional employer constraint: companyName or fullName required
export const employerSchemaWithIntent = employerSchema.refine((data: any) => !!(data.companyName || data.fullName), {
  message: 'Provide either company name or your full name',
  path: ['companyName'],
});

// TypeScript types
export type UserType = 'student' | 'institution' | 'employer';

export type BaseUserData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
};
export type StudentRegistrationData = z.infer<typeof studentSchema>;
export type InstitutionRegistrationData = z.infer<typeof institutionSchema>;
export type EmployerRegistrationData = z.infer<typeof employerSchema>;
export type RegistrationData = z.infer<typeof registrationSchema>;

// Registration configuration
export interface RegistrationConfig {
  userType: UserType;
  title: string;
  description: string;
  iconName: string;
  endpoint: string;
  successMessage: string;
}

export const REGISTRATION_CONFIGS: Record<UserType, RegistrationConfig> = {
  student: {
    userType: 'student',
    title: 'Student Registration',
    description: 'Create your student account to access certificates',
    iconName: 'academic-cap',
    endpoint: '/students/register',
    successMessage: 'Your student account has been created successfully. Please check your email for verification instructions.',
  },
  institution: {
    userType: 'institution',
    title: 'Institution Registration',
    description: 'Register your educational institution to issue certificates',
    iconName: 'building-office',
    endpoint: '/institution-registration/register',
    successMessage: 'Your institution registration has been submitted successfully. Please check your email for verification instructions. Your account will be activated after ministry approval.',
  },
  employer: {
    userType: 'employer',
    title: 'Employer Registration',
    description: 'Register your company to verify employee certificates',
    iconName: 'building-office',
    endpoint: '/employer-registration/register',
    successMessage: 'Your employer account has been created successfully. Please check your email for verification instructions.',
  },
};
