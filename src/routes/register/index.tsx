import { createFileRoute } from '@tanstack/react-router';

import { Register } from '@/components/pages/auth/register';
import { requireGuest } from '@/lib/route-guards';

export const Route = createFileRoute('/register/')({
	beforeLoad: async ({ context }) => {
		// Block authenticated users from accessing register page
		requireGuest(context.auth);
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Register />;
}
