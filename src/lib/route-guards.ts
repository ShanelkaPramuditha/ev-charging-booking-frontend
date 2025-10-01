import { redirect } from '@tanstack/react-router';

import type { IAuthContext } from '@/types/auth';

/**
 * Route guard that requires authentication
 * Redirects to login page if user is not authenticated
 */
export const requireAuth = (auth: IAuthContext) => {
	if (!auth.isAuthenticated && !auth.isLoading) {
		throw redirect({
			to: '/',
			search: {
				redirect: location.pathname,
			},
		});
	}
};

/**
 * Route guard that blocks authenticated users
 * Redirects to dashboard if user is already authenticated
 */
export const requireGuest = (auth: IAuthContext) => {
	if (auth.isAuthenticated) {
		throw redirect({
			to: '/',
		});
	}
};
