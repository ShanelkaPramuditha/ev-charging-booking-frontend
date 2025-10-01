import { Outlet } from '@tanstack/react-router';

import { Header } from '@/components/partials/header';
import { AppSidebar } from '@/components/partials/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export function Layout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className='flex flex-col flex-1 min-h-screen bg-background'>
				{/* Header */}
				<Header />
				{/* Main Content */}
				<main className='p-2 h-full w-full'>
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
