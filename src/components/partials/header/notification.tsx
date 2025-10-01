import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

export default function Notification() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='ghost' size='sm' className='relative'>
					<Bell className='h-4 w-4' />
					{/* <span className='absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full'></span> */}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-80'>
				<div className='space-y-2'>
					<h4 className='font-medium'>Notifications</h4>
					<div className='text-sm text-muted-foreground'>
						No new notifications
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
