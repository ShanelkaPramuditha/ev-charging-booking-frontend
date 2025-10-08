import { createFileRoute } from '@tanstack/react-router';

import { StationsPage } from '@/components/pages/stations';

export const Route = createFileRoute('/_authenticated/stations')({
	component: RouteComponent,
});

function RouteComponent() {
	return <StationsPage />;
}
