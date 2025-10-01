import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import authService, {
	type LoginRequest,
	type LoginResponse,
	type RegisterRequest,
	type RegisterResponse,
} from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Hook for login mutation
 * Handles user login with email and password
 */
export const useLoginMutation = (): UseMutationResult<
	LoginResponse,
	Error,
	LoginRequest,
	unknown
> => {
	const navigate = useNavigate();
	const login = useAuthStore((state) => state.login);

	return useMutation({
		mutationKey: ['login'],
		mutationFn: (credentials: LoginRequest) => authService.login(credentials),
		onSuccess: (data) => {
			// Update Zustand store
			login(data.user, data.token);

			toast.success('Login successful!', {
				description: `Welcome back, ${data.user.username}!`,
			});

			// Redirect to dashboard after successful login
			navigate({ to: '/dashboard' });
		},
		onError: (error: Error) => {
			toast.error('Login failed', {
				description: error.message || 'Invalid email or password',
			});
		},
	});
};

/**
 * Hook for register mutation
 * Handles new user registration
 */
export const useRegisterMutation = (): UseMutationResult<
	RegisterResponse,
	Error,
	RegisterRequest,
	unknown
> => {
	const navigate = useNavigate();
	const login = useAuthStore((state) => state.login);

	return useMutation({
		mutationKey: ['register'],
		mutationFn: (userData: RegisterRequest) => authService.register(userData),
		onSuccess: (data) => {
			toast.success('Registration successful!', {
				description: `Welcome, ${data.user.username}! Your account has been created.`,
			});

			// If token is returned, user is logged in automatically
			if (data.token) {
				// Update Zustand store
				login(data.user, data.token);

				// Redirect to dashboard
				navigate({ to: '/dashboard' });
			} else {
				// Otherwise, redirect to login
				navigate({ to: '/login' });
			}
		},
		onError: (error: Error) => {
			toast.error('Registration failed', {
				description:
					error.message || 'Unable to create account. Please try again.',
			});
		},
	});
};

/**
 * Hook for logout
 * Clears authentication and redirects to login
 */
export const useLogout = () => {
	const navigate = useNavigate();
	const logout = useAuthStore((state) => state.logout);

	const handleLogout = () => {
		logout();
		toast.info('Logged out successfully');
		navigate({ to: '/login' });
	};

	return handleLogout;
};
