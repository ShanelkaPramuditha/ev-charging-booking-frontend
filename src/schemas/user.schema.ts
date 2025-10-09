import { z } from 'zod';

/**
 * User role enum schema
 */
export const userRoleSchema = z.enum(['backOffice', 'operator', 'evOwner'], {
	message: 'Please select a valid role',
});

/**
 * User status enum schema
 */
export const userStatusSchema = z.enum(['active', 'inactive'], {
	message: 'Please select a valid status',
});

/**
 * Phone number validation (optional)
 */
const phoneSchema = z
	.string()
	.regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
	.min(10, 'Phone number must be at least 10 characters')
	.max(20, 'Phone number must not exceed 20 characters')
	.optional()
	.or(z.literal(''));

/**
 * Base user schema (without refinement, so it can be extended)
 */
const baseUserSchema = z.object({
	username: z
		.string()
		.min(1, 'Username is required')
		.min(2, 'Username must be at least 2 characters')
		.max(100, 'Username must not exceed 100 characters')
		.trim(),
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email format')
		.toLowerCase()
		.trim(),
	role: userRoleSchema,
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.max(100, 'Password must not exceed 100 characters'),
	phoneNumber: phoneSchema,
	address: z
		.string()
		.max(500, 'Address must not exceed 500 characters')
		.optional()
		.or(z.literal('')),
	nic: z.string().optional().or(z.literal('')),
});

/**
 * Zod schema for creating a new user
 */
export const createUserSchema = baseUserSchema.superRefine((data, ctx) => {
	// NIC is required for evOwner role
	if (data.role === 'evOwner') {
		if (!data.nic || data.nic.trim() === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'NIC is required for EV Owner role',
				path: ['nic'],
			});
		} else {
			// Validate NIC format
			const nicRegex = /^(\d{12}|\d{9}[vV])$/;
			if (!nicRegex.test(data.nic)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'NIC must be either 12 digits or 9 digits ending with V/v',
					path: ['nic'],
				});
			}
		}
	}
});

/**
 * Zod schema for updating a user
 */
export const updateUserSchema = z
	.object({
		username: z
			.string()
			.min(2, 'Username must be at least 2 characters')
			.max(100, 'Username must not exceed 100 characters')
			.trim(),
		email: z.string().email('Invalid email format').toLowerCase().trim(),
		role: userRoleSchema,
		phoneNumber: phoneSchema,
		address: z
			.string()
			.max(500, 'Address must not exceed 500 characters')
			.optional()
			.or(z.literal('')),
		nic: z.string().optional().or(z.literal('')),
		status: userStatusSchema.optional(),
	})
	.superRefine((data, ctx) => {
		// NIC is required for evOwner role
		if (data.role === 'evOwner') {
			if (!data.nic || data.nic.trim() === '') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'NIC is required for EV Owner role',
					path: ['nic'],
				});
			} else {
				// Validate NIC format
				const nicRegex = /^(\d{12}|\d{9}[vV])$/;
				if (!nicRegex.test(data.nic)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'NIC must be either 12 digits or 9 digits ending with V/v',
						path: ['nic'],
					});
				}
			}
		}
	});

/**
 * Zod schema for EV Owner profile
 */
export const evOwnerProfileSchema = baseUserSchema
	.extend({
		role: z.literal('evOwner'),
		vehicleInfo: z
			.object({
				make: z.string().optional(),
				model: z.string().optional(),
				year: z
					.number()
					.min(1900, 'Invalid year')
					.max(new Date().getFullYear() + 1, 'Invalid year')
					.optional(),
				licensePlate: z.string().optional(),
				batteryCapacity: z
					.number()
					.positive('Must be a positive number')
					.optional(),
			})
			.optional(),
		preferredPaymentMethod: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		// NIC is required for evOwner
		if (!data.nic || data.nic.trim() === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'NIC is required for EV Owner',
				path: ['nic'],
			});
		} else {
			// Validate NIC format
			const nicRegex = /^(\d{12}|\d{9}[vV])$/;
			if (!nicRegex.test(data.nic)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'NIC must be either 12 digits or 9 digits ending with V/v',
					path: ['nic'],
				});
			}
		}
	});

/**
 * Zod schema for user filters
 */
export const userFilterSchema = z.object({
	search: z.string().optional(),
	role: userRoleSchema.optional(),
	status: userStatusSchema.optional(),
	page: z.number().positive().optional(),
	limit: z.number().positive().optional(),
	sortBy: z.string().optional(),
	sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * TypeScript types inferred from Zod schemas
 */
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type EVOwnerProfileFormData = z.infer<typeof evOwnerProfileSchema>;
export type UserFilterData = z.infer<typeof userFilterSchema>;
