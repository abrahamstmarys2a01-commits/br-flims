import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const createAdminUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().email('Valid email address required').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['superadmin', 'editor']),
});

export const updateAdminUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(['superadmin', 'editor']).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
});
