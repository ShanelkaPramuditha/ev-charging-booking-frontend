import { createFileRoute } from '@tanstack/react-router';

import { Settings } from '@/components/pages/settings';
import {
	defaultSettingsTab,
	settingsTabSchema,
} from '@/config/search/settings';

export const Route = createFileRoute('/_authenticated/settings')({
	validateSearch: (search: Record<string, unknown>) => {
		const parsed = settingsTabSchema.safeParse(search.tab);

		return {
			tab: parsed.success ? parsed.data : defaultSettingsTab,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Settings />;
}
