/**
 * Booking status enum matching backend
 */
export enum BookingStatus {
	Pending = 'Pending',
	Approved = 'Approved',
	Cancelled = 'Cancelled',
	Completed = 'Completed',
}

/**
 * Time slot interface
 */
export interface ITimeSlot {
	startTime: string; // Format: "HH:MM"
	endTime: string; // Format: "HH:MM"
}

/**
 * Main booking interface
 */
export interface IBooking {
	id: string;
	evOwnerId: string;
	evOwnerName: string;
	stationId: string;
	stationName: string;
	stationAddress: string;
	bookingDate: string; // ISO date string
	timeSlot: ITimeSlot;
	status: BookingStatus;
	qrCode: string;
	vehicleInfo: string;
	notes: string;
	cancellationReason: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Booking summary for list views
 */
export interface IBookingSummary {
	id: string;
	stationName: string;
	stationAddress: string;
	bookingDate: string;
	timeSlot: ITimeSlot;
	status: BookingStatus;
}

/**
 * Booking QR response
 */
export interface IBookingQR {
	id: string;
	qrCode: string;
	stationName: string;
	stationAddress: string;
	bookingDate: string;
	timeSlot: ITimeSlot;
}

/**
 * QR validation result
 */
export interface IQRValidation {
	isValid: boolean;
	booking?: IBooking;
}

/**
 * Booking count statistics
 */
export interface IBookingCounts {
	pendingCount: number;
	approvedCount: number;
	todayCount: number;
	cancelledCount: number;
	completedCount: number;
	totalCount: number;
}

// Request types
export interface ICreateBookingRequest {
	stationId: string;
	bookingDate: string; // ISO date string
	timeSlot: ITimeSlot;
	vehicleInfo?: string;
	notes?: string;
}

export interface IUpdateBookingRequest {
	bookingDate: string;
	timeSlot: ITimeSlot;
	vehicleInfo?: string;
	notes?: string;
}

export interface ICancelBookingRequest {
	cancellationReason: string;
}

export interface ICompleteBookingRequest {
	completed: boolean;
	notes?: string;
}

export interface IQRValidationRequest {
	qrCode: string;
}
