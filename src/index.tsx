import '@/styles/globals.css';
import 'leaflet/dist/leaflet.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';

import { Loader } from '@/components/state/loader';
import { useAuth } from '@/context/auth/use-auth';
import { router } from '@/router';
import { useAuthStore } from '@/stores/auth.store';

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
		},
		mutations: {
			retry: 0,
		},
	},
});

/**
 * AuthInitializer - Loads persisted auth state from localStorage on app start
 */
function AuthInitializer() {
	const initAuth = useAuthStore((state) => state.initAuth);

	useEffect(() => {
		initAuth();
	}, [initAuth]);

	return null;
}

export function RouterContent() {
	const auth = useAuth();

	if (auth.isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<Loader />
			</div>
		);
	}

	return (
		<RouterProvider
			router={router}
			context={{
				auth,
			}}
		/>
	);
}

const rootEl = document.getElementById('root');
if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<AuthInitializer />
				<RouterContent />
				<Toaster position='bottom-right' richColors />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</StrictMode>,
	);
}
