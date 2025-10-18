/**
 * User role types
 */
export type UserRole = 'backOffice' | 'operator' | 'evOwner';

export enum USER_ROLES {
	BACK_OFFICE = 'backOffice',
	OPERATOR = 'operator',
	EV_OWNER = 'evOwner',
}

/**
 * Base user interface
 */
export interface IUser {
	id: string;
	isActive: boolean;
	role: USER_ROLES;
	email: string;
	nic?: string;
	username: string;
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Extended user interface with role and status
 */
export interface IUserProfile extends IUser {
	isActive: boolean;
	phoneNumber?: string;
	address?: string;
	lastLogin?: Date;
}

/**
 * EV Owner specific profile
 */
export interface IEVOwnerProfile extends IUserProfile {
	role: USER_ROLES.EV_OWNER;
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
	nic?: string;
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
	nic?: string;
}

/**
 * User list response
 */
export type IUserListResponse = IUserProfile[];
