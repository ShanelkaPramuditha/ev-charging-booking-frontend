import { createFileRoute } from '@tanstack/react-router';

import { CreateStationPage } from '@/components/pages/stations/create-station-page';

export const Route = createFileRoute('/_authenticated/stations/create')({
	component: RouteComponent,
});

function RouteComponent() {
	return <CreateStationPage />;
}
