import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits');
export const nationalIdSchema = z.string().min(5, 'National ID must be at least 5 characters');

// Certificate validation
export const certificateSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  programId: z.string().min(1, 'Program ID is required'),
  templateId: z.string().min(1, 'Template ID is required'),
  grade: z.string().optional(),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional(),
  additionalFields: z.record(z.string(), z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Student validation
export const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  nationalId: nationalIdSchema,
  phone: phoneSchema.optional(),
  program: z.string().min(1, 'Program is required'),
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
});

// Program validation
export const programSchema = z.object({
  name: z.string().min(1, 'Program name is required'),
  code: z.string().min(1, 'Program code is required'),
  description: z.string().optional(),
  duration: z.string().optional(),
  credits: z.number().min(1, 'Credits must be at least 1').optional(),
});

// Template validation
export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  fields: z.array(z.string()).min(1, 'At least one field is required'),
  layout: z.string().optional(),
});

// Bulk operations validation
export const bulkIssueSchema = z.object({
  templateId: z.string().min(1, 'Template ID is required'),
  students: z.array(studentSchema).min(1, 'At least one student is required'),
  fieldMapping: z.record(z.string(), z.string()).optional(),
});

// Search validation
export const searchSchema = z.object({
  query: z.string().optional(),
  filters: z.record(z.string(), z.any()).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Verification validation
export const verificationSchema = z.object({
  certificateId: z.string().min(1, 'Certificate ID is required'),
});

export const nationalIdVerificationSchema = z.object({
  nationalId: z.string().min(1, 'National ID is required'),
  organizationId: z.string().min(1, 'Organization ID is required'),
});
