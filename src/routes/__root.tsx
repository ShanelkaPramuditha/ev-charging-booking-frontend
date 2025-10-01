import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import type { IAuthContext } from '@/types/auth';

interface RouterContext {
	auth: IAuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return <Outlet />;
}
