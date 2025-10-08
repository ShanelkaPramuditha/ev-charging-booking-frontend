/**
 * Station type definitions
 */

export interface IStation {
	id: string;
	name: string;
	operatorId: string;
	operatorName?: string;
	location: {
		latitude: number;
		longitude: number;
	};
	type: string; // "DC Fast Charger", etc.
	totalSlots: number;
	availableSlots: number;
	schedule: IStationSchedule[];
	isActive: boolean;
	address: string;
	contactPhone?: string;
	pricePerHour?: number; // Optional since API doesn't return it
	createdAt: string;
	updatedAt: string;
}

export interface IStationLocation {
	latitude: number;
	longitude: number;
}

export interface IStationSchedule {
	dayOfWeek: number; // 1-7 (Monday to Sunday)
	openTime: string; // HH:mm format
	closeTime: string; // HH:mm format
	isOpen: boolean;
}

export interface INearbyStation extends IStation {
	distance: number; // in kilometers
}

// Request types
export interface CreateStationRequest {
	name: string;
	operatorId: string;
	location: IStationLocation;
	type: string;
	totalSlots: number;
	address: string;
	contactPhone?: string;
	schedule: IStationSchedule[];
	pricePerHour?: number;
}

export interface UpdateStationRequest {
	name?: string;
	location?: IStationLocation;
	type?: string;
	address?: string;
	contactPhone?: string;
	pricePerHour?: number;
}

export interface UpdateStationSlotsRequest {
	availableSlots: number;
}

export interface UpdateStationScheduleRequest {
	schedule: IStationSchedule[];
}

export interface AssignOperatorRequest {
	operatorId: string;
}

export interface UpdateStationStatusRequest {
	isActive: boolean;
}
