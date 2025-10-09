import type {
	IBooking,
	IBookingCounts,
	IBookingQR,
	ICancelBookingRequest,
	ICompleteBookingRequest,
	ICreateBookingRequest,
	IQRValidation,
	IQRValidationRequest,
	IUpdateBookingRequest,
} from '@/types/booking';

import apiClient from './api-client';

/**
 * Booking service for managing charging station bookings
 */
class BookingService {
	private readonly baseURL = '/bookings';

	/**
	 * Get all bookings (Backoffice only)
	 */
	async getAllBookings(): Promise<IBooking[]> {
		return await apiClient.get<IBooking[]>(this.baseURL);
	}

	/**
	 * Get booking by ID
	 */
	async getBookingById(id: string): Promise<IBooking> {
		return await apiClient.get<IBooking>(`${this.baseURL}/${id}`);
	}

	/**
	 * Get bookings for current EV owner
	 */
	async getMyBookings(): Promise<IBooking[]> {
		return await apiClient.get<IBooking[]>(`${this.baseURL}/my-bookings`);
	}

	/**
	 * Get upcoming bookings for current EV owner
	 */
	async getMyUpcomingBookings(): Promise<IBooking[]> {
		return await apiClient.get<IBooking[]>(`${this.baseURL}/my-upcoming`);
	}

	/**
	 * Get booking history for current EV owner
	 */
	async getMyBookingHistory(): Promise<IBooking[]> {
		return await apiClient.get<IBooking[]>(`${this.baseURL}/my-history`);
	}

	/**
	 * Get bookings for a specific EV owner (Backoffice only)
	 */
	async getBookingsByEVOwner(evOwnerId: string): Promise<IBooking[]> {
		return await apiClient.get<IBooking[]>(
			`${this.baseURL}/ev-owner/${evOwnerId}`,
		);
	}

	/**
	 * Get bookings for a specific station
	 */
	async getBookingsByStation(stationId: string): Promise<IBooking[]> {
		return await apiClient.get<IBooking[]>(
			`${this.baseURL}/station/${stationId}`,
		);
	}

	/**
	 * Get active bookings for a specific station
	 */
	async getActiveBookingsByStation(stationId: string): Promise<IBooking[]> {
		return await apiClient.get<IBooking[]>(
			`${this.baseURL}/station/${stationId}/active`,
		);
	}

	/**
	 * Create a new booking (EVOwner only)
	 */
	async createBooking(data: ICreateBookingRequest): Promise<IBooking> {
		return await apiClient.post<IBooking>(this.baseURL, data);
	}

	/**
	 * Update a booking (EVOwner only, at least 12h before booking time)
	 */
	async updateBooking(
		id: string,
		data: IUpdateBookingRequest,
	): Promise<IBooking> {
		return await apiClient.put<IBooking>(`${this.baseURL}/${id}`, data);
	}

	/**
	 * Cancel a booking
	 */
	async cancelBooking(
		id: string,
		data: ICancelBookingRequest,
	): Promise<IBooking> {
		return await apiClient.patch<IBooking>(
			`${this.baseURL}/${id}/cancel`,
			data,
		);
	}

	/**
	 * Approve a booking (Backoffice or station operator)
	 */
	async approveBooking(id: string): Promise<IBooking> {
		return await apiClient.patch<IBooking>(`${this.baseURL}/${id}/approve`);
	}

	/**
	 * Complete a booking (Backoffice or station operator)
	 */
	async completeBooking(
		id: string,
		data: ICompleteBookingRequest,
	): Promise<IBooking> {
		return await apiClient.patch<IBooking>(
			`${this.baseURL}/${id}/complete`,
			data,
		);
	}

	/**
	 * Generate QR code for a booking (EVOwner only)
	 */
	async generateQRCode(id: string): Promise<IBookingQR> {
		return await apiClient.get<IBookingQR>(`${this.baseURL}/${id}/qr`);
	}

	/**
	 * Validate a booking QR code (Backoffice or station operator)
	 */
	async validateQRCode(data: IQRValidationRequest): Promise<IQRValidation> {
		return await apiClient.post<IQRValidation>(
			`${this.baseURL}/validate-qr`,
			data,
		);
	}

	/**
	 * Get booking counts for the current user (EVOwner only)
	 */
	async getMyBookingCounts(): Promise<IBookingCounts> {
		return await apiClient.get<IBookingCounts>(`${this.baseURL}/my-counts`);
	}

	/**
	 * Get booking counts for a specific station
	 */
	async getStationBookingCounts(stationId: string): Promise<IBookingCounts> {
		return await apiClient.get<IBookingCounts>(
			`${this.baseURL}/station/${stationId}/counts`,
		);
	}
}

export const bookingService = new BookingService();
