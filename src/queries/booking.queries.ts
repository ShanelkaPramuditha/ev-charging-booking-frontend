import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { bookingService } from '@/services/booking.service';
import type {
	ICancelBookingRequest,
	ICompleteBookingRequest,
	ICreateBookingRequest,
	IQRValidationRequest,
	IUpdateBookingRequest,
} from '@/types/booking';

/**
 * Query keys for booking-related queries
 */
export const bookingKeys = {
	all: ['bookings'] as const,
	lists: () => [...bookingKeys.all, 'list'] as const,
	list: (filters: string) => [...bookingKeys.lists(), { filters }] as const,
	details: () => [...bookingKeys.all, 'detail'] as const,
	detail: (id: string) => [...bookingKeys.details(), id] as const,
	myBookings: () => [...bookingKeys.all, 'my-bookings'] as const,
	myUpcoming: () => [...bookingKeys.all, 'my-upcoming'] as const,
	myHistory: () => [...bookingKeys.all, 'my-history'] as const,
	byEVOwner: (evOwnerId: string) =>
		[...bookingKeys.all, 'ev-owner', evOwnerId] as const,
	byStation: (stationId: string) =>
		[...bookingKeys.all, 'station', stationId] as const,
	activeByStation: (stationId: string) =>
		[...bookingKeys.all, 'station', stationId, 'active'] as const,
	myCounts: () => [...bookingKeys.all, 'my-counts'] as const,
	stationCounts: (stationId: string) =>
		[...bookingKeys.all, 'station', stationId, 'counts'] as const,
};

/**
 * Get all bookings (Backoffice only)
 */
export function useBookings() {
	return useQuery({
		queryKey: bookingKeys.lists(),
		queryFn: () => bookingService.getAllBookings(),
	});
}

/**
 * Get booking by ID
 */
export function useBooking(id: string) {
	return useQuery({
		queryKey: bookingKeys.detail(id),
		queryFn: () => bookingService.getBookingById(id),
		enabled: !!id,
	});
}

/**
 * Get bookings for current EV owner
 */
export function useMyBookings() {
	return useQuery({
		queryKey: bookingKeys.myBookings(),
		queryFn: () => bookingService.getMyBookings(),
	});
}

/**
 * Get upcoming bookings for current EV owner
 */
export function useMyUpcomingBookings() {
	return useQuery({
		queryKey: bookingKeys.myUpcoming(),
		queryFn: () => bookingService.getMyUpcomingBookings(),
	});
}

/**
 * Get booking history for current EV owner
 */
export function useMyBookingHistory() {
	return useQuery({
		queryKey: bookingKeys.myHistory(),
		queryFn: () => bookingService.getMyBookingHistory(),
	});
}

/**
 * Get bookings for a specific EV owner (Backoffice only)
 */
export function useBookingsByEVOwner(evOwnerId: string) {
	return useQuery({
		queryKey: bookingKeys.byEVOwner(evOwnerId),
		queryFn: () => bookingService.getBookingsByEVOwner(evOwnerId),
		enabled: !!evOwnerId,
	});
}

/**
 * Get bookings for a specific station
 */
export function useBookingsByStation(stationId: string) {
	return useQuery({
		queryKey: bookingKeys.byStation(stationId),
		queryFn: () => bookingService.getBookingsByStation(stationId),
		enabled: !!stationId,
	});
}

/**
 * Get active bookings for a specific station
 */
export function useActiveBookingsByStation(stationId: string) {
	return useQuery({
		queryKey: bookingKeys.activeByStation(stationId),
		queryFn: () => bookingService.getActiveBookingsByStation(stationId),
		enabled: !!stationId,
	});
}

/**
 * Get booking counts for current user
 */
export function useMyBookingCounts() {
	return useQuery({
		queryKey: bookingKeys.myCounts(),
		queryFn: () => bookingService.getMyBookingCounts(),
	});
}

/**
 * Get booking counts for a specific station
 */
export function useStationBookingCounts(stationId: string) {
	return useQuery({
		queryKey: bookingKeys.stationCounts(stationId),
		queryFn: () => bookingService.getStationBookingCounts(stationId),
		enabled: !!stationId,
	});
}

/**
 * Create a new booking
 */
export function useCreateBooking() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ICreateBookingRequest) =>
			bookingService.createBooking(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: bookingKeys.all });
			toast.success('Booking created successfully');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to create booking');
		},
	});
}

/**
 * Update a booking
 */
export function useUpdateBooking() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: IUpdateBookingRequest }) =>
			bookingService.updateBooking(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: bookingKeys.all });
			queryClient.invalidateQueries({
				queryKey: bookingKeys.detail(variables.id),
			});
			toast.success('Booking updated successfully');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to update booking');
		},
	});
}

/**
 * Cancel a booking
 */
export function useCancelBooking() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ICancelBookingRequest }) =>
			bookingService.cancelBooking(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: bookingKeys.all });
			queryClient.invalidateQueries({
				queryKey: bookingKeys.detail(variables.id),
			});
			toast.success('Booking cancelled successfully');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to cancel booking');
		},
	});
}

/**
 * Approve a booking
 */
export function useApproveBooking() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => bookingService.approveBooking(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: bookingKeys.all });
			queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
			toast.success('Booking approved successfully');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to approve booking');
		},
	});
}

/**
 * Complete a booking
 */
export function useCompleteBooking() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ICompleteBookingRequest }) =>
			bookingService.completeBooking(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: bookingKeys.all });
			queryClient.invalidateQueries({
				queryKey: bookingKeys.detail(variables.id),
			});
			toast.success('Booking completed successfully');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to complete booking');
		},
	});
}

/**
 * Generate QR code for a booking
 */
export function useGenerateQRCode(id: string) {
	return useQuery({
		queryKey: [...bookingKeys.detail(id), 'qr'],
		queryFn: () => bookingService.generateQRCode(id),
		enabled: !!id,
	});
}

/**
 * Validate a QR code
 */
export function useValidateQRCode() {
	return useMutation({
		mutationFn: (data: IQRValidationRequest) =>
			bookingService.validateQRCode(data),
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to validate QR code');
		},
	});
}
