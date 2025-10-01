import { createFileRoute } from '@tanstack/react-router';

import { UserDashboard } from '@/components/pages/dashboard';

export const Route = createFileRoute('/_authenticated/dashboard')({
	component: RouteComponent,
});

function RouteComponent() {
	return <UserDashboard />;
}
