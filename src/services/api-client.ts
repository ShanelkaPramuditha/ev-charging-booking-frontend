import axios, {
	AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
} from 'axios';

import { useAuthStore } from '@/stores/auth.store';

/**
 * API Client - Centralized axios instance for all API calls
 */
class ApiClient {
	private instance: AxiosInstance;

	constructor() {
		this.instance = axios.create({
			baseURL: import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3000',
			timeout: 30000,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
	}

	/**
	 * Setup request and response interceptors
	 */
	private setupInterceptors() {
		// Request interceptor to add auth token
		this.instance.interceptors.request.use(
			(config) => {
				// Import store dynamically to avoid circular dependencies
				const token = useAuthStore.getState().token;

				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}

				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);

		// Response interceptor to handle errors
		this.instance.interceptors.response.use(
			(response) => {
				return response;
			},
			(error: AxiosError) => {
				// Handle common errors
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					const { status, data } = error.response;

					switch (status) {
						case 401: {
							// Unauthorized - clear auth from store and redirect to login
							useAuthStore.getState().logout();
							window.location.href = '/login';
							break;
						}
						case 403:
							console.error('Access forbidden');
							break;
						case 404:
							console.error('Resource not found');
							break;
						case 500:
							console.error('Server error');
							break;
						default:
							console.error('API Error:', data);
					}
				} else if (error.request) {
					// The request was made but no response was received
					console.error('Network error - no response received');
				} else {
					// Something happened in setting up the request that triggered an Error
					console.error('Request setup error:', error.message);
				}

				return Promise.reject(error);
			},
		);
	}

	/**
	 * Get the axios instance
	 */
	public getInstance(): AxiosInstance {
		return this.instance;
	}

	/**
	 * GET request
	 */
	public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.instance.get<T>(url, config);
		return response.data;
	}

	/**
	 * POST request
	 */
	public async post<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response = await this.instance.post<T>(url, data, config);
		return response.data;
	}

	/**
	 * PUT request
	 */
	public async put<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response = await this.instance.put<T>(url, data, config);
		return response.data;
	}

	/**
	 * PATCH request
	 */
	public async patch<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response = await this.instance.patch<T>(url, data, config);
		return response.data;
	}

	/**
	 * DELETE request
	 */
	public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.instance.delete<T>(url, config);
		return response.data;
	}
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
