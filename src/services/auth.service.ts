import type { IUser } from '@/types/user';

import apiClient from './api-client';

/**
 * Authentication API endpoints
 */
const AUTH_ENDPOINTS = {
	LOGIN: '/api/auth/login',
	REGISTER: '/api/auth/register',
} as const;

/**
 * Login request payload
 */
export interface LoginRequest {
	email: string;
	password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
	token: string;
	username: string;
	email: string;
	role: string;
	expiresAt: string;
	user: IUser;
	message?: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
	username: string;
	email: string;
	role: 'backOffice' | 'operator' | 'evOwner';
	password: string;
}

/**
 * Register response
 */
export interface RegisterResponse {
	token?: string;
	username?: string;
	email?: string;
	role?: string;
	expiresAt?: string;
	user: IUser;
	message?: string;
}

/**
 * Auth Service - Handles all authentication related API calls
 */
export const authService = {
	/**
	 * Login user
	 */
	login: async (credentials: LoginRequest): Promise<LoginResponse> => {
		const response = await apiClient.post<LoginResponse>(
			AUTH_ENDPOINTS.LOGIN,
			credentials,
		);

		return response;
	},

	/**
	 * Register new user
	 */
	register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
		const response = await apiClient.post<RegisterResponse>(
			AUTH_ENDPOINTS.REGISTER,
			userData,
		);

		return response;
	},
};

export default authService;
