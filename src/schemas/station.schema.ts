import { z } from 'zod';

/**
 * Station location schema
 */
export const stationLocationSchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
});

/**
 * Station schedule schema
 */
export const stationScheduleSchema = z.object({
	dayOfWeek: z.number().min(1).max(7), // 1-7 (Monday to Sunday)
	openTime: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
	closeTime: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
	isOpen: z.boolean(),
});

/**
 * Station type enum
 */
export const stationTypeEnum = z.enum(['DC Fast Charger', 'AC Charger'], {
	message: 'Please select a valid station type',
});

/**
 * Create station schema
 */
export const createStationSchema = z.object({
	name: z.string().min(1, 'Station name is required'),
	operatorId: z.string().min(1, 'Operator ID is required'),
	location: stationLocationSchema,
	type: stationTypeEnum,
	totalSlots: z.number().min(1, 'Must have at least 1 slot'),
	address: z.string().min(1, 'Address is required'),
	contactPhone: z
		.string()
		.regex(/^\d{10}$/, 'Contact phone must be exactly 10 digits')
		.optional(),
	schedule: z
		.array(stationScheduleSchema)
		.min(1, 'At least one schedule is required'),
});

/**
 * Update station schema
 */
export const updateStationSchema = z.object({
	name: z.string().min(1, 'Station name is required'),
	operatorId: z.string().min(1, 'Operator ID is required'),
	location: stationLocationSchema,
	type: stationTypeEnum,
	totalSlots: z.number().min(1, 'Must have at least 1 slot'),
	address: z.string().min(1, 'Address is required'),
	contactPhone: z
		.string()
		.regex(/^\d{10}$/, 'Contact phone must be exactly 10 digits'),
});

/**
 * Update slots schema
 */
export const updateSlotsSchema = z.object({
	availableSlots: z.number().min(0, 'Available slots cannot be negative'),
});

/**
 * Update schedule schema
 */
export const updateScheduleSchema = z.object({
	schedule: z
		.array(stationScheduleSchema)
		.min(1, 'At least one schedule is required'),
});

/**
 * Assign operator schema
 */
export const assignOperatorSchema = z.object({
	operatorId: z.string().min(1, 'Operator ID is required'),
});

/**
 * Update status schema
 */
export const updateStatusSchema = z.object({
	isActive: z.boolean(),
});

// Type exports
export type CreateStationFormData = z.infer<typeof createStationSchema>;
export type UpdateStationFormData = z.infer<typeof updateStationSchema>;
export type UpdateSlotsFormData = z.infer<typeof updateSlotsSchema>;
export type UpdateScheduleFormData = z.infer<typeof updateScheduleSchema>;
export type AssignOperatorFormData = z.infer<typeof assignOperatorSchema>;
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;
