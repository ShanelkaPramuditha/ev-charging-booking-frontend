import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/lib/route-guards';
import { Layout } from '@/routes/-layout';

export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ context }) => {
		// Require authentication for all routes under this layout
		requireAuth(context.auth);
	},
	component: Layout,
});
