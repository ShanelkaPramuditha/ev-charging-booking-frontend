import { z } from 'zod';

/**
 * Time slot schema
 */
export const timeSlotSchema = z.object({
	startTime: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
	endTime: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
});

/**
 * Create booking schema
 */
export const createBookingSchema = z.object({
	stationId: z.string().min(1, 'Station is required'),
	bookingDate: z.string().min(1, 'Booking date is required'),
	timeSlot: timeSlotSchema,
	vehicleInfo: z.string().optional(),
	notes: z.string().optional(),
});

/**
 * Update booking schema
 */
export const updateBookingSchema = z.object({
	bookingDate: z.string().min(1, 'Booking date is required'),
	timeSlot: timeSlotSchema,
	vehicleInfo: z.string().optional(),
	notes: z.string().optional(),
});

/**
 * Cancel booking schema
 */
export const cancelBookingSchema = z.object({
	cancellationReason: z
		.string()
		.min(10, 'Cancellation reason must be at least 10 characters'),
});

/**
 * Complete booking schema
 */
export const completeBookingSchema = z.object({
	completed: z.boolean(),
	notes: z.string().optional(),
});

/**
 * QR validation schema
 */
export const qrValidationSchema = z.object({
	qrCode: z.string().min(1, 'QR code is required'),
});

// Type exports
export type CreateBookingFormData = z.infer<typeof createBookingSchema>;
export type UpdateBookingFormData = z.infer<typeof updateBookingSchema>;
export type CancelBookingFormData = z.infer<typeof cancelBookingSchema>;
export type CompleteBookingFormData = z.infer<typeof completeBookingSchema>;
export type QRValidationFormData = z.infer<typeof qrValidationSchema>;
