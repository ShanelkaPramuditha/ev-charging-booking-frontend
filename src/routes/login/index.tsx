import { createFileRoute } from '@tanstack/react-router';

import { Login } from '@/components/pages/auth/login';
import { requireGuest } from '@/lib/route-guards';

export const Route = createFileRoute('/login/')({
	beforeLoad: async ({ context }) => {
		// Block authenticated users from accessing login page
		requireGuest(context.auth);
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Login />;
}
