/**
 * Station type definitions
 */

export interface IOperator {
	id: string;
	username: string;
	email: string;
	isActive: boolean;
}

export interface IStation {
	id: string;
	name: string;
	operatorId: string;
	operator?: IOperator; // Populated operator object
	location: {
		latitude: number;
		longitude: number;
	};
	type: string; // "DC Fast Charger" or "AC Charger"
	totalSlots: number;
	availableSlots: number;
	schedule: IStationSchedule[];
	isActive: boolean;
	address: string;
	contactPhone?: string;
	createdAt: string;
	updatedAt: string;
}

export interface IStationLocation {
	latitude: number;
	longitude: number;
}

export interface IStationSchedule {
	dayOfWeek: number; // 1-7 (Monday to Sunday, where 1 = Monday)
	openTime: string; // HH:mm format (e.g., "08:00")
	closeTime: string; // HH:mm format (e.g., "20:00")
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
}

export interface UpdateStationRequest {
	name: string;
	operatorId: string;
	location: IStationLocation;
	type: string;
	totalSlots: number;
	address: string;
	contactPhone: string;
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
