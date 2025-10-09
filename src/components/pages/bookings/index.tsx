import { Calendar, Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth/use-auth';
import {
	useBookings,
	useMyBookingCounts,
	useMyBookings,
} from '@/queries/booking.queries';
import { BookingStatus } from '@/types/booking';

import { BookingCard } from './booking-card';
import { CreateBookingDialog } from './create-booking-dialog';

export function BookingsPage() {
	const { user } = useAuth();
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>(
		'all',
	);
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	// Role-based data fetching
	const userProfile = user as import('@/types/user').IUserProfile;
	const isBackoffice = userProfile?.role === 'backOffice';
	const isEVOwner = userProfile?.role === 'evOwner';

	const { data: allBookings, isLoading: isLoadingAll } = useBookings();
	const { data: myBookings, isLoading: isLoadingMy } = useMyBookings();
	const { data: counts } = useMyBookingCounts();

	const bookings = isBackoffice ? allBookings : myBookings;
	const isLoading = isBackoffice ? isLoadingAll : isLoadingMy;

	// Filter bookings
	const filteredBookings = bookings?.filter((booking) => {
		const matchesSearch =
			booking.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			booking.stationAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
			booking.evOwnerName.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === 'all' || booking.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	return (
		<div className='container mx-auto p-6 space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						{isEVOwner ? 'My Bookings' : 'Bookings Management'}
					</h1>
					<p className='text-muted-foreground'>
						{isEVOwner
							? 'View and manage your charging station bookings'
							: 'Manage all charging station bookings'}
					</p>
				</div>
				{isEVOwner && (
					<Button onClick={() => setShowCreateDialog(true)}>
						<Plus className='mr-2 h-4 w-4' />
						New Booking
					</Button>
				)}
			</div>

			{/* Stats for EV Owners */}
			{isEVOwner && counts && (
				<div className='grid gap-4 md:grid-cols-4'>
					<div className='rounded-lg border bg-card p-4'>
						<div className='flex items-center justify-between'>
							<p className='text-sm font-medium text-muted-foreground'>
								Pending
							</p>
							<Calendar className='h-4 w-4 text-muted-foreground' />
						</div>
						<p className='mt-2 text-2xl font-bold'>{counts.pendingCount}</p>
					</div>
					<div className='rounded-lg border bg-card p-4'>
						<div className='flex items-center justify-between'>
							<p className='text-sm font-medium text-muted-foreground'>
								Approved
							</p>
							<Calendar className='h-4 w-4 text-muted-foreground' />
						</div>
						<p className='mt-2 text-2xl font-bold'>{counts.approvedCount}</p>
					</div>
					<div className='rounded-lg border bg-card p-4'>
						<div className='flex items-center justify-between'>
							<p className='text-sm font-medium text-muted-foreground'>Today</p>
							<Calendar className='h-4 w-4 text-muted-foreground' />
						</div>
						<p className='mt-2 text-2xl font-bold'>{counts.todayCount}</p>
					</div>
					<div className='rounded-lg border bg-card p-4'>
						<div className='flex items-center justify-between'>
							<p className='text-sm font-medium text-muted-foreground'>
								Completed
							</p>
							<Calendar className='h-4 w-4 text-muted-foreground' />
						</div>
						<p className='mt-2 text-2xl font-bold'>{counts.completedCount}</p>
					</div>
				</div>
			)}

			{/* Filters */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Search by station name, address, or owner...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='pl-10'
					/>
				</div>
				<div className='flex items-center gap-2'>
					<Filter className='h-4 w-4 text-muted-foreground' />
					<select
						value={statusFilter}
						onChange={(e) =>
							setStatusFilter(e.target.value as BookingStatus | 'all')
						}
						className='flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
					>
						<option value='all'>All Status</option>
						<option value={BookingStatus.Pending}>Pending</option>
						<option value={BookingStatus.Approved}>Approved</option>
						<option value={BookingStatus.Completed}>Completed</option>
						<option value={BookingStatus.Cancelled}>Cancelled</option>
					</select>
				</div>
			</div>

			{/* Bookings List */}
			{isLoading ? (
				<div className='flex items-center justify-center py-12'>
					<div className='text-center'>
						<div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto' />
						<p className='mt-4 text-sm text-muted-foreground'>
							Loading bookings...
						</p>
					</div>
				</div>
			) : filteredBookings && filteredBookings.length > 0 ? (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{filteredBookings.map((booking) => (
						<BookingCard key={booking.id} booking={booking} />
					))}
				</div>
			) : (
				<div className='flex flex-col items-center justify-center py-12 text-center'>
					<Calendar className='h-12 w-12 text-muted-foreground mb-4' />
					<h3 className='text-lg font-semibold'>No bookings found</h3>
					<p className='text-sm text-muted-foreground mt-2'>
						{searchTerm || statusFilter !== 'all'
							? 'Try adjusting your filters'
							: isEVOwner
								? 'Create your first booking to get started'
								: 'No bookings have been created yet'}
					</p>
					{isEVOwner && !searchTerm && statusFilter === 'all' && (
						<Button
							onClick={() => setShowCreateDialog(true)}
							className='mt-4'
							variant='outline'
						>
							<Plus className='mr-2 h-4 w-4' />
							Create Booking
						</Button>
					)}
				</div>
			)}

			{/* Create Booking Dialog */}
			{isEVOwner && (
				<CreateBookingDialog
					open={showCreateDialog}
					onOpenChange={setShowCreateDialog}
				/>
			)}
		</div>
	);
}
