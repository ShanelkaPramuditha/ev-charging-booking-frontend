import { useNavigate } from '@tanstack/react-router';
import { Calendar, Settings2, SquareTerminal, Zap } from 'lucide-react';
import type * as React from 'react';

import { NavMain } from '@/components/partials/sidebar/nav-items';
import { NavUser } from '@/components/partials/sidebar/nav-user';
import { Button } from '@/components/ui/button';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth/use-auth';
import { useLogout } from '@/queries/auth.queries';
import { USER_ROLES } from '@/types/user';

const navItems = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: SquareTerminal,
		isActive: true,
		users: [USER_ROLES.BACK_OFFICE, USER_ROLES.OPERATOR, USER_ROLES.EV_OWNER],
	},
	{
		title: 'Bookings',
		url: '#',
		icon: Calendar,
		items: [
			{
				title: 'My Bookings',
				url: '/bookings',
			},
		],
		users: [USER_ROLES.EV_OWNER],
	},
	{
		title: 'Stations',
		url: '#',
		icon: Zap,
		items: [
			{
				title: 'All Stations',
				url: '/stations',
			},
		],
	},
	{
		title: 'Settings',
		url: '#',
		icon: Settings2,
		items: [
			{
				title: 'Account',
				url: '/settings?tab=account',
			},
			{
				title: 'General',
				url: '/settings?tab=general',
			},
			{
				title: 'Users',
				url: '/settings?tab=users',
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAuth();
	const navigate = useNavigate();
	const logout = useLogout();

	const handleLogout = () => {
		logout();
	};

	if (!user) return null;
	// Show only items allowed for the current user's role; if `users` is omitted, it's visible to all
	const filteredNavItems = navItems.filter(
		(item) => !item.users || item.users.includes(user.role),
	);

	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<div className='flex items-center gap-2 justify-between'>
					<Button
						size={'icon'}
						variant={'ghost'}
						className='bg-secondary'
						onClick={() => navigate({ to: '/' })}
					>
						CC
					</Button>
					<SidebarTrigger />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={filteredNavItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} onClickLogout={handleLogout} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
