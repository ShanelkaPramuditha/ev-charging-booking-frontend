import { createFileRoute } from '@tanstack/react-router';

import { StationDetailsPage } from '@/components/pages/stations/station-details-page';

export const Route = createFileRoute('/_authenticated/stations/$stationId/')({
	component: StationDetailsPage,
});
