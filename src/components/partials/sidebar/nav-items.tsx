import { useNavigate } from '@tanstack/react-router';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const navigate = useNavigate();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className='group/collapsible'
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton
									tooltip={item.title}
									onClick={() => {
										if (!item.items) {
											navigate({ to: item.url });
										}
									}}
								>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									<ChevronRight
										className={cn(
											'ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90',
											{ hidden: !item.items },
										)}
									/>
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent hidden={!item.items}>
								<SidebarMenuSub>
									{item.items?.map((subItem) => (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton asChild>
												<Button
													onClick={() => navigate({ to: subItem.url })}
													className='w-full justify-start'
													variant='ghost'
												>
													{subItem.title}
												</Button>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
