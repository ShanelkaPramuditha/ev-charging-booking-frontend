import { Calendar, Clock, MapPin, MoreVertical } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth/use-auth';
import { BookingStatus, type IBooking } from '@/types/booking';

interface BookingCardProps {
	booking: IBooking;
}

const statusColors = {
	[BookingStatus.Pending]: 'bg-yellow-500/10 text-yellow-700',
	[BookingStatus.Approved]: 'bg-green-500/10 text-green-700',
	[BookingStatus.Completed]: 'bg-blue-500/10 text-blue-700',
	[BookingStatus.Cancelled]: 'bg-red-500/10 text-red-700',
};

export function BookingCard({ booking }: BookingCardProps) {
	const { user } = useAuth();

	const userProfile = user as import('@/types/user').IUserProfile;
	const isEVOwner = userProfile?.role === 'evOwner';
	const isBackofficeOrOperator =
		userProfile?.role === 'backOffice' || userProfile?.role === 'operator';

	const bookingDate = new Date(booking.bookingDate);
	const isUpcoming = bookingDate > new Date();

	return (
		<Card>
			<CardHeader className='flex flex-row items-start justify-between space-y-0 pb-2'>
				<div className='space-y-1 flex-1'>
					<h3 className='font-semibold'>{booking.stationName}</h3>
					<div className='flex items-center text-sm text-muted-foreground'>
						<MapPin className='mr-1 h-3 w-3' />
						{booking.stationAddress}
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon'>
							<MoreVertical className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						{booking.status === BookingStatus.Approved && isEVOwner && (
							<DropdownMenuItem
								onClick={() => {
									/* TODO: Implement QR code dialog */
								}}
							>
								View QR Code
							</DropdownMenuItem>
						)}
						{booking.status === BookingStatus.Pending &&
							isBackofficeOrOperator && (
								<DropdownMenuItem>Approve</DropdownMenuItem>
							)}
						{booking.status === BookingStatus.Approved &&
							isBackofficeOrOperator && (
								<DropdownMenuItem>Complete</DropdownMenuItem>
							)}
						{booking.status === BookingStatus.Pending &&
							isUpcoming &&
							isEVOwner && (
								<>
									<DropdownMenuItem>Edit</DropdownMenuItem>
									<DropdownMenuSeparator />
								</>
							)}
						{booking.status !== BookingStatus.Cancelled &&
							booking.status !== BookingStatus.Completed && (
								<DropdownMenuItem
									onClick={() => {
										/* TODO: Implement cancel dialog */
									}}
									className='text-destructive'
								>
									Cancel
								</DropdownMenuItem>
							)}
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			<CardContent className='space-y-3'>
				<div className='flex items-center justify-between'>
					<Badge className={statusColors[booking.status]}>
						{booking.status}
					</Badge>
					<div className='flex items-center text-sm text-muted-foreground'>
						<Calendar className='mr-1 h-3 w-3' />
						{bookingDate.toLocaleDateString()}
					</div>
				</div>

				<div className='flex items-center text-sm'>
					<Clock className='mr-2 h-4 w-4 text-muted-foreground' />
					<span>
						{booking.timeSlot.startTime} - {booking.timeSlot.endTime}
					</span>
				</div>

				{booking.vehicleInfo && (
					<p className='text-sm text-muted-foreground'>{booking.vehicleInfo}</p>
				)}

				{booking.notes && (
					<p className='text-sm text-muted-foreground italic'>
						Note: {booking.notes}
					</p>
				)}

				{booking.cancellationReason && (
					<div className='rounded-md bg-destructive/10 p-2'>
						<p className='text-sm text-destructive'>
							Cancelled: {booking.cancellationReason}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
