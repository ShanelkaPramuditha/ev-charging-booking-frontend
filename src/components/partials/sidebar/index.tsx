import { useNavigate } from '@tanstack/react-router';
import { BookOpen, Bot, Settings2, SquareTerminal } from 'lucide-react';
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

const navItems = [
	{
		title: 'Playground',
		url: '#',
		icon: SquareTerminal,
		isActive: true,
		items: [
			{
				title: 'History',
				url: '#',
			},
			{
				title: 'Starred',
				url: '#',
			},
			{
				title: 'Settings',
				url: '#',
			},
		],
	},
	{
		title: 'Models',
		url: '#',
		icon: Bot,
		items: [
			{
				title: 'Genesis',
				url: '#',
			},
			{
				title: 'Explorer',
				url: '#',
			},
			{
				title: 'Quantum',
				url: '#',
			},
		],
	},
	{
		title: 'Documentation',
		url: '#',
		icon: BookOpen,
		items: [
			{
				title: 'Introduction',
				url: '#',
			},
			{
				title: 'Get Started',
				url: '#',
			},
			{
				title: 'Tutorials',
				url: '#',
			},
			{
				title: 'Changelog',
				url: '#',
			},
		],
	},
	{
		title: 'Settings',
		url: '#',
		icon: Settings2,
		items: [
			{
				title: 'General',
				url: '#',
			},
			{
				title: 'Team',
				url: '#',
			},
			{
				title: 'Billing',
				url: '#',
			},
			{
				title: 'Limits',
				url: '#',
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
				<NavMain items={navItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} onClickLogout={handleLogout} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
