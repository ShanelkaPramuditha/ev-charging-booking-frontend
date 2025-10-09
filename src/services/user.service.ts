import type {
	ICreateUserRequest,
	IUpdateUserRequest,
	IUserListResponse,
	IUserProfile,
	UserRole,
} from '@/types/user';

import apiClient from './api-client';

/**
 * User API endpoints
 */
const USER_ENDPOINTS = {
	USERS: '/api/users',
	USER_BY_ID: (id: string) => `/api/users/${id}`,
	ACTIVATE: (id: string) => `/api/users/${id}/activate`,
	DEACTIVATE: (id: string) => `/api/users/${id}/deactivate`,
	BY_ROLE: (role: UserRole) => `/api/users/role/${role}`,
} as const;

/**
 * User query parameters
 */
export interface UserQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	role?: UserRole;
	status?: 'active' | 'inactive';
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

/**
 * User Service - Handles all user management related API calls
 */
export const userService = {
	/**
	 * Get all users with optional filtering and pagination
	 */
	getUsers: async (params?: UserQueryParams): Promise<IUserListResponse> => {
		const queryParams = new URLSearchParams();

		if (params?.page) queryParams.append('page', params.page.toString());
		if (params?.limit) queryParams.append('limit', params.limit.toString());
		if (params?.search) queryParams.append('search', params.search);
		if (params?.role) queryParams.append('role', params.role);
		if (params?.status) queryParams.append('status', params.status);
		if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
		if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

		const url = `${USER_ENDPOINTS.USERS}?${queryParams.toString()}`;
		const response = await apiClient.get<IUserListResponse>(url);

		return response;
	},

	/**
	 * Get user by ID
	 */
	getUserById: async (id: string): Promise<IUserProfile> => {
		const response = await apiClient.get<IUserProfile>(
			USER_ENDPOINTS.USER_BY_ID(id),
		);

		return response;
	},

	/**
	 * Get users by role
	 */
	getUsersByRole: async (role: UserRole): Promise<IUserProfile[]> => {
		const response = await apiClient.get<IUserProfile[]>(
			USER_ENDPOINTS.BY_ROLE(role),
		);

		return response;
	},

	/**
	 * Create new user
	 */
	createUser: async (userData: ICreateUserRequest): Promise<IUserProfile> => {
		const response = await apiClient.post<IUserProfile>(
			USER_ENDPOINTS.USERS,
			userData,
		);

		return response;
	},

	/**
	 * Update user
	 */
	updateUser: async (
		id: string,
		userData: IUpdateUserRequest,
	): Promise<IUserProfile> => {
		const response = await apiClient.put<IUserProfile>(
			USER_ENDPOINTS.USER_BY_ID(id),
			userData,
		);

		return response;
	},

	/**
	 * Delete user
	 */
	deleteUser: async (id: string): Promise<{ message: string }> => {
		const response = await apiClient.delete<{ message: string }>(
			USER_ENDPOINTS.USER_BY_ID(id),
		);

		return response;
	},

	/**
	 * Activate user
	 */
	activateUser: async (id: string): Promise<IUserProfile> => {
		const response = await apiClient.patch<IUserProfile>(
			USER_ENDPOINTS.ACTIVATE(id),
		);

		return response;
	},

	/**
	 * Deactivate user
	 */
	deactivateUser: async (id: string): Promise<IUserProfile> => {
		const response = await apiClient.patch<IUserProfile>(
			USER_ENDPOINTS.DEACTIVATE(id),
		);

		return response;
	},
};

export default userService;
