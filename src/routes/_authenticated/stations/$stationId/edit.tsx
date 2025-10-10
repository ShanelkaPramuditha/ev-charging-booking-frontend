import { createFileRoute } from '@tanstack/react-router';

import { EditStationPage } from '@/components/pages/stations/edit-station-page';

export const Route = createFileRoute(
	'/_authenticated/stations/$stationId/edit',
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { stationId } = Route.useParams();
	return <EditStationPage stationId={stationId} />;
}
