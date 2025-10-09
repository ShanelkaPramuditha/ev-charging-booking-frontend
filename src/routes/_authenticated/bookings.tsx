import { createFileRoute } from '@tanstack/react-router';

import { BookingsPage } from '@/components/pages/bookings';

export const Route = createFileRoute('/_authenticated/bookings')({
	component: BookingsPage,
});
