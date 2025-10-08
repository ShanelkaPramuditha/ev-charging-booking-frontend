import {
	useMutation,
	type UseMutationResult,
	useQuery,
	useQueryClient,
	type UseQueryResult,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import stationService from '@/services/station.service';
import type {
	AssignOperatorRequest,
	CreateStationRequest,
	INearbyStation,
	IStation,
	UpdateStationRequest,
	UpdateStationScheduleRequest,
	UpdateStationSlotsRequest,
	UpdateStationStatusRequest,
} from '@/types/station';

/**
 * Query keys for station queries
 */
export const stationKeys = {
	all: ['stations'] as const,
	lists: () => [...stationKeys.all, 'list'] as const,
	list: (filters?: string) => [...stationKeys.lists(), filters] as const,
	active: () => [...stationKeys.all, 'active'] as const,
	details: () => [...stationKeys.all, 'detail'] as const,
	detail: (id: string) => [...stationKeys.details(), id] as const,
	byOperator: (operatorId: string) =>
		[...stationKeys.all, 'operator', operatorId] as const,
	nearby: (lat: number, lng: number, maxDistance: number) =>
		[...stationKeys.all, 'nearby', lat, lng, maxDistance] as const,
};

/**
 * Hook to get all stations
 */
export const useStations = (): UseQueryResult<IStation[], Error> => {
	return useQuery({
		queryKey: stationKeys.list(),
		queryFn: () => stationService.getAllStations(),
	});
};

/**
 * Hook to get active stations
 */
export const useActiveStations = (): UseQueryResult<IStation[], Error> => {
	return useQuery({
		queryKey: stationKeys.active(),
		queryFn: () => stationService.getActiveStations(),
	});
};

/**
 * Hook to get station by ID
 */
export const useStation = (
	id: string,
	enabled: boolean = true,
): UseQueryResult<IStation, Error> => {
	return useQuery({
		queryKey: stationKeys.detail(id),
		queryFn: () => stationService.getStationById(id),
		enabled: enabled && !!id,
	});
};

/**
 * Hook to get stations by operator
 */
export const useStationsByOperator = (
	operatorId: string,
	enabled: boolean = true,
): UseQueryResult<IStation[], Error> => {
	return useQuery({
		queryKey: stationKeys.byOperator(operatorId),
		queryFn: () => stationService.getStationsByOperator(operatorId),
		enabled: enabled && !!operatorId,
	});
};

/**
 * Hook to get nearby stations
 */
export const useNearbyStations = (
	latitude: number,
	longitude: number,
	maxDistance: number = 10,
	limit: number = 10,
	enabled: boolean = true,
): UseQueryResult<INearbyStation[], Error> => {
	return useQuery({
		queryKey: stationKeys.nearby(latitude, longitude, maxDistance),
		queryFn: () =>
			stationService.getNearbyStations(latitude, longitude, maxDistance, limit),
		enabled: enabled && !!latitude && !!longitude,
	});
};

/**
 * Hook to create a new station
 */
export const useCreateStation = (): UseMutationResult<
	IStation,
	Error,
	CreateStationRequest,
	unknown
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateStationRequest) =>
			stationService.createStation(data),
		onSuccess: (data) => {
			toast.success('Station created successfully', {
				description: `${data.name} has been added to the system.`,
			});
			queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
		},
		onError: (error: Error) => {
			toast.error('Failed to create station', {
				description: error.message || 'Please try again.',
			});
		},
	});
};

/**
 * Hook to update station
 */
export const useUpdateStation = (): UseMutationResult<
	IStation,
	Error,
	{ id: string; data: UpdateStationRequest },
	unknown
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateStationRequest }) =>
			stationService.updateStation(id, data),
		onSuccess: (data) => {
			toast.success('Station updated successfully', {
				description: `${data.name} has been updated.`,
			});
			queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: stationKeys.detail(data.id) });
		},
		onError: (error: Error) => {
			toast.error('Failed to update station', {
				description: error.message || 'Please try again.',
			});
		},
	});
};

/**
 * Hook to update available slots
 */
export const useUpdateStationSlots = (): UseMutationResult<
	IStation,
	Error,
	{ id: string; data: UpdateStationSlotsRequest },
	unknown
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateStationSlotsRequest;
		}) => stationService.updateAvailableSlots(id, data),
		onSuccess: (data) => {
			toast.success('Slots updated successfully');
			queryClient.invalidateQueries({ queryKey: stationKeys.detail(data.id) });
			queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
		},
		onError: (error: Error) => {
			toast.error('Failed to update slots', {
				description: error.message || 'Please try again.',
			});
		},
	});
};

/**
 * Hook to update station schedule
 */
export const useUpdateStationSchedule = (): UseMutationResult<
	IStation,
	Error,
	{ id: string; data: UpdateStationScheduleRequest },
	unknown
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateStationScheduleRequest;
		}) => stationService.updateSchedule(id, data),
		onSuccess: (data) => {
			toast.success('Schedule updated successfully');
			queryClient.invalidateQueries({ queryKey: stationKeys.detail(data.id) });
			queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
		},
		onError: (error: Error) => {
			toast.error('Failed to update schedule', {
				description: error.message || 'Please try again.',
			});
		},
	});
};

/**
 * Hook to assign operator
 */
export const useAssignOperator = (): UseMutationResult<
	IStation,
	Error,
	{ id: string; data: AssignOperatorRequest },
	unknown
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: AssignOperatorRequest }) =>
			stationService.assignOperator(id, data),
		onSuccess: (data) => {
			toast.success('Operator assigned successfully');
			queryClient.invalidateQueries({ queryKey: stationKeys.detail(data.id) });
			queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
		},
		onError: (error: Error) => {
			toast.error('Failed to assign operator', {
				description: error.message || 'Please try again.',
			});
		},
	});
};

/**
 * Hook to update station status
 */
export const useUpdateStationStatus = (): UseMutationResult<
	IStation,
	Error,
	{ id: string; data: UpdateStationStatusRequest },
	unknown
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateStationStatusRequest;
		}) => stationService.updateStationStatus(id, data),
		onSuccess: (data) => {
			toast.success(
				`Station ${data.isActive ? 'activated' : 'deactivated'} successfully`,
			);
			queryClient.invalidateQueries({ queryKey: stationKeys.detail(data.id) });
			queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
		},
		onError: (error: Error) => {
			toast.error('Failed to update station status', {
				description: error.message || 'Please try again.',
			});
		},
	});
};

/**
 * Hook to delete station
 */
export const useDeleteStation = (): UseMutationResult<
	void,
	Error,
	string,
	unknown
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => stationService.deleteStation(id),
		onSuccess: () => {
			toast.success('Station deleted successfully');
			queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
		},
		onError: (error: Error) => {
			toast.error('Failed to delete station', {
				description:
					error.message || 'Cannot delete station with active bookings.',
			});
		},
	});
};
