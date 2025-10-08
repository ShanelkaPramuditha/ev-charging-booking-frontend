/**
 * User role types
 */
export type UserRole = 'backOffice' | 'operator' | 'evOwner';

/**
 * Base user interface
 */
export interface IUser {
	id: string;
	email: string;
	username: string;
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Extended user interface with role and status
 */
export interface IUserProfile extends IUser {
	role: UserRole;
	isActive: boolean;
	phoneNumber?: string;
	address?: string;
	lastLogin?: Date;
}

/**
 * EV Owner specific profile
 */
export interface IEVOwnerProfile extends IUserProfile {
	role: 'evOwner';
	vehicleInfo?: {
		make?: string;
		model?: string;
		year?: number;
		licensePlate?: string;
		batteryCapacity?: number;
	};
	preferredPaymentMethod?: string;
}

/**
 * User creation request
 */
export interface ICreateUserRequest {
	username: string;
	email: string;
	role: UserRole;
	password: string;
	phoneNumber?: string;
	address?: string;
}

/**
 * User update request
 */
export interface IUpdateUserRequest {
	username?: string;
	email?: string;
	phoneNumber?: string;
	address?: string;
	role?: UserRole;
	isActive?: boolean;
}

/**
 * User list response
 */
export type IUserListResponse = IUserProfile[];
