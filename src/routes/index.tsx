import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	beforeLoad: async ({ context }) => {
		// Redirect based on authentication status
		if (context.auth.isAuthenticated) {
			throw redirect({
				to: '/dashboard',
			});
		} else {
			throw redirect({
				to: '/login',
			});
		}
	},
});
