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

import apiClient from './api-client';

/**
 * Station API endpoints
 */
const STATION_ENDPOINTS = {
	BASE: '/api/stations',
	ACTIVE: '/api/stations/active',
	BY_ID: (id: string) => `/api/stations/${id}`,
	BY_OPERATOR: (operatorId: string) => `/api/stations/operator/${operatorId}`,
	NEARBY: '/api/stations/nearby',
	UPDATE_SLOTS: (id: string) => `/api/stations/${id}/slots`,
	UPDATE_SCHEDULE: (id: string) => `/api/stations/${id}/schedule`,
	ASSIGN_OPERATOR: (id: string) => `/api/stations/${id}/operator`,
	UPDATE_STATUS: (id: string) => `/api/stations/${id}/status`,
} as const;

/**
 * Station Service - Handles all station related API calls
 */
export const stationService = {
	/**
	 * Get all stations
	 */
	getAllStations: async (): Promise<IStation[]> => {
		return await apiClient.get<IStation[]>(STATION_ENDPOINTS.BASE);
	},

	/**
	 * Get all active stations
	 */
	getActiveStations: async (): Promise<IStation[]> => {
		return await apiClient.get<IStation[]>(STATION_ENDPOINTS.ACTIVE);
	},

	/**
	 * Get station by ID
	 */
	getStationById: async (id: string): Promise<IStation> => {
		return await apiClient.get<IStation>(STATION_ENDPOINTS.BY_ID(id));
	},

	/**
	 * Get stations by operator ID
	 */
	getStationsByOperator: async (operatorId: string): Promise<IStation[]> => {
		return await apiClient.get<IStation[]>(
			STATION_ENDPOINTS.BY_OPERATOR(operatorId),
		);
	},

	/**
	 * Get nearby stations
	 */
	getNearbyStations: async (
		latitude: number,
		longitude: number,
		maxDistance: number = 10,
		limit: number = 10,
	): Promise<INearbyStation[]> => {
		return await apiClient.get<INearbyStation[]>(STATION_ENDPOINTS.NEARBY, {
			params: { latitude, longitude, maxDistance, limit },
		});
	},

	/**
	 * Create a new station
	 */
	createStation: async (data: CreateStationRequest): Promise<IStation> => {
		return await apiClient.post<IStation>(STATION_ENDPOINTS.BASE, data);
	},

	/**
	 * Update station details
	 */
	updateStation: async (
		id: string,
		data: UpdateStationRequest,
	): Promise<IStation> => {
		return await apiClient.put<IStation>(STATION_ENDPOINTS.BY_ID(id), data);
	},

	/**
	 * Update available slots
	 */
	updateAvailableSlots: async (
		id: string,
		data: UpdateStationSlotsRequest,
	): Promise<IStation> => {
		return await apiClient.patch<IStation>(
			STATION_ENDPOINTS.UPDATE_SLOTS(id),
			data,
		);
	},

	/**
	 * Update station schedule
	 */
	updateSchedule: async (
		id: string,
		data: UpdateStationScheduleRequest,
	): Promise<IStation> => {
		return await apiClient.patch<IStation>(
			STATION_ENDPOINTS.UPDATE_SCHEDULE(id),
			data,
		);
	},

	/**
	 * Assign operator to station
	 */
	assignOperator: async (
		id: string,
		data: AssignOperatorRequest,
	): Promise<IStation> => {
		return await apiClient.patch<IStation>(
			STATION_ENDPOINTS.ASSIGN_OPERATOR(id),
			data,
		);
	},

	/**
	 * Update station status (activate/deactivate)
	 */
	updateStationStatus: async (
		id: string,
		data: UpdateStationStatusRequest,
	): Promise<IStation> => {
		return await apiClient.patch<IStation>(
			STATION_ENDPOINTS.UPDATE_STATUS(id),
			data,
		);
	},

	/**
	 * Delete station
	 */
	deleteStation: async (id: string): Promise<void> => {
		return await apiClient.delete<void>(STATION_ENDPOINTS.BY_ID(id));
	},
};

export default stationService;
