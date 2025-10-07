import { z } from 'zod';

/**
 * Zod schema for login form validation
 */
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email format')
		.toLowerCase()
		.trim(),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Zod schema for registration form validation
 */
export const registerSchema = z
	.object({
		username: z
			.string()
			.min(1, 'Name is required')
			.min(2, 'Name must be at least 2 characters')
			.max(100, 'Name must not exceed 100 characters')
			.trim(),
		email: z
			.string()
			.min(1, 'Email is required')
			.email('Invalid email format')
			.toLowerCase()
			.trim(),
		role: z.enum(['backOffice', 'operator', 'evOwner']),
		password: z
			.string()
			.min(6, 'Password must be at least 6 characters')
			.max(100, 'Password must not exceed 100 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

/**
 * TypeScript types inferred from Zod schemas
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
