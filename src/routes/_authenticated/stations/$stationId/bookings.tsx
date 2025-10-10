import { createFileRoute } from '@tanstack/react-router';

import { BookingsTable } from '@/components/pages/stations/bookings-table';

export const Route = createFileRoute(
	'/_authenticated/stations/$stationId/bookings',
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { stationId } = Route.useParams();

	return <BookingsTable stationId={stationId} />;
}
