import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { IUser } from '@/types/user';

/**
 * Auth Store State Interface
 */
interface AuthState {
	// State
	user: IUser | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	// Actions
	setUser: (user: IUser | null) => void;
	setToken: (token: string | null) => void;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	setIsLoading: (isLoading: boolean) => void;
	login: (user: IUser, token: string) => void;
	logout: () => void;
	initAuth: () => void;
}

/**
 * Auth Store - Manages authentication state using Zustand
 * Persists auth data to localStorage for session persistence
 */
export const useAuthStore = create<AuthState>()(
	devtools(
		persist(
			(set, get) => ({
				// Initial State
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: true,

				// Actions
				setUser: (user) => set({ user }),

				setToken: (token) => set({ token }),

				setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

				setIsLoading: (isLoading) => set({ isLoading }),

				/**
				 * Login - Store user and token (auto-persisted to localStorage)
				 */
				login: (user, token) => {
					set({
						user,
						token,
						isAuthenticated: true,
						isLoading: false,
					});
				},

				/**
				 * Logout - Clear user and auth state (auto-removed from localStorage)
				 */
				logout: () => {
					set({
						user: null,
						token: null,
						isAuthenticated: false,
						isLoading: false,
					});
				},

				/**
				 * Initialize auth state from localStorage
				 */
				initAuth: () => {
					const state = get();

					// Check if we have persisted token and user
					if (state.token && state.user) {
						set({
							isAuthenticated: true,
							isLoading: false,
						});
					} else {
						set({
							user: null,
							token: null,
							isAuthenticated: false,
							isLoading: false,
						});
					}
				},
			}),
			{
				name: 'auth-storage', // localStorage key
				partialize: (state) => ({
					user: state.user,
					token: state.token,
				}),
			},
		),
		{
			name: 'AuthStore', // DevTools name
		},
	),
);

/**
 * Selectors for optimized re-renders
 */
export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;
export const selectIsAuthenticated = (state: AuthState) =>
	state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
