import { format } from 'date-fns';
import {
	BookmarkCheck,
	Calendar,
	Car,
	Check,
	Clock,
	Eye,
	Info,
	MapPin,
	MessageSquare,
	User,
	X,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
	useApproveBooking,
	useBookingsByStation,
	useCancelBooking,
	useCompleteBooking,
} from '@/queries/booking.queries';
import { BookingStatus, type IBooking } from '@/types/booking';

interface BookingsTableProps {
	stationId: string;
}

export function BookingsTable({ stationId }: BookingsTableProps) {
	const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
	const [showCard, setShowCard] = useState(false);
	const { data: bookings, isLoading } = useBookingsByStation(stationId);
	const [activeTab, setActiveTab] = useState<string>('all');

	const approveBooking = useApproveBooking();
	const cancelBooking = useCancelBooking();
	const completeBooking = useCompleteBooking();

	// Filter bookings based on active tab
	const handleViewDetails = async (booking: IBooking) => {
		setSelectedBooking(booking);
		setShowCard(true);
	};
	const filteredBookings = bookings?.filter((booking) => {
		if (activeTab === 'all') return true;
		if (activeTab === 'pending')
			return booking.status === BookingStatus.Pending;
		if (activeTab === 'approved')
			return booking.status === BookingStatus.Approved;
		if (activeTab === 'completed')
			return booking.status === BookingStatus.Completed;
		if (activeTab === 'cancelled')
			return booking.status === BookingStatus.Cancelled;
		return true;
	});

	const getStatusColor = (status: BookingStatus) => {
		switch (status) {
			case BookingStatus.Pending:
				return 'bg-yellow-100 text-yellow-800';
			case BookingStatus.Approved:
				return 'bg-green-100 text-green-800';
			case BookingStatus.Completed:
				return 'bg-blue-100 text-blue-800';
			case BookingStatus.Cancelled:
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const handleApprove = (id: string) => {
		approveBooking.mutate(id);
	};

	const handleCancel = (id: string) => {
		const reason = prompt('Enter cancellation reason:');
		if (reason) {
			cancelBooking.mutate({ id, data: { cancellationReason: reason } });
		}
	};

	const handleComplete = (id: string) => {
		completeBooking.mutate({ id, data: { completed: true } });
	};

	const handleCloseCard = () => {
		setSelectedBooking(null);
	};

	const getStatusAppearance = (status: BookingStatus) => {
		switch (status) {
			case BookingStatus.Pending:
				return 'border-yellow-500/50 bg-yellow-50 text-yellow-800';
			case BookingStatus.Approved:
				return 'border-green-500/50 bg-green-50 text-green-800';
			case BookingStatus.Completed:
				return 'border-blue-500/50 bg-blue-50 text-blue-800';
			case BookingStatus.Cancelled:
				return 'border-red-500/50 bg-red-50 text-red-800';
			default:
				return 'border-gray-500/50 bg-gray-50 text-gray-800';
		}
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-8'>
				<p className='text-muted-foreground'>Loading bookings...</p>
			</div>
		);
	}

	if (!bookings || bookings.length === 0) {
		return (
			<div className='flex items-center justify-center p-8'>
				<p className='text-muted-foreground'>
					No bookings found for this station.
				</p>
			</div>
		);
	}

	const counts = {
		all: bookings.length,
		pending: bookings.filter((b) => b.status === BookingStatus.Pending).length,
		approved: bookings.filter((b) => b.status === BookingStatus.Approved)
			.length,
		completed: bookings.filter((b) => b.status === BookingStatus.Completed)
			.length,
		cancelled: bookings.filter((b) => b.status === BookingStatus.Cancelled)
			.length,
	};

	return (
		<div className='space-y-4'>
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value='all'>All ({counts.all})</TabsTrigger>
					<TabsTrigger value='pending'>Pending ({counts.pending})</TabsTrigger>
					<TabsTrigger value='approved'>
						Approved ({counts.approved})
					</TabsTrigger>
					<TabsTrigger value='completed'>
						Completed ({counts.completed})
					</TabsTrigger>
					<TabsTrigger value='cancelled'>
						Cancelled ({counts.cancelled})
					</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className='mt-4'>
					<div className='rounded-md border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Customer</TableHead>
									<TableHead>Date & Time</TableHead>
									<TableHead>Time Slot</TableHead>
									<TableHead>Vehicle</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredBookings?.map((booking) => (
									<TableRow key={booking.id}>
										<TableCell>
											<div>
												<p className='font-medium'>{booking.evOwnerName}</p>
											</div>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<Calendar className='h-4 w-4 text-muted-foreground' />
												<span>
													{format(
														new Date(booking.bookingDate),
														'MMM dd, yyyy',
													)}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<Clock className='h-4 w-4 text-muted-foreground' />
												<span>
													{booking.timeSlot.startTime} -{' '}
													{booking.timeSlot.endTime}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<span className='text-sm'>
												{booking.vehicleInfo || 'N/A'}
											</span>
										</TableCell>
										<TableCell>
											<Badge
												className={cn(
													'text-xs',
													getStatusColor(booking.status),
												)}
											>
												{booking.status}
											</Badge>
										</TableCell>
										<TableCell className='text-right'>
											<div className='flex items-center justify-end gap-2'>
												<Button
													variant='ghost'
													size='icon'
													title='View Details'
													onClick={() => handleViewDetails(booking)}
												>
													<Eye className='h-4 w-4' />
												</Button>
												{booking.status === BookingStatus.Pending && (
													<>
														<Button
															variant='ghost'
															size='icon'
															onClick={() => handleApprove(booking.id)}
															title='Approve'
														>
															<Check className='h-4 w-4 text-green-600' />
														</Button>
														<Button
															variant='ghost'
															size='icon'
															onClick={() => handleCancel(booking.id)}
															title='Cancel'
														>
															<X className='h-4 w-4 text-red-600' />
														</Button>
													</>
												)}
												{booking.status === BookingStatus.Approved && (
													<>
														<Button
															variant='ghost'
															size='icon'
															onClick={() => handleComplete(booking.id)}
															title='Mark as Completed'
														>
															<BookmarkCheck className='h-4 w-4 text-blue-600' />
														</Button>
														<Button
															variant='ghost'
															size='icon'
															onClick={() => handleCancel(booking.id)}
															title='Cancel'
														>
															<X className='h-4 w-4 text-red-600' />
														</Button>
													</>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</TabsContent>
			</Tabs>

			{/* Dialog for booking details */}
			<Dialog open={showCard} onOpenChange={setShowCard}>
				<DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<div className='space-y-1'>
							<DialogTitle className='text-2xl font-bold'>
								Booking Details
							</DialogTitle>
							<p className='text-sm text-muted-foreground mt-1'>
								ID: {selectedBooking?.id}
							</p>
							{selectedBooking && (
								<Badge
									className={cn(
										'text-sm',
										getStatusAppearance(selectedBooking.status),
									)}
								>
									{selectedBooking.status}
								</Badge>
							)}
						</div>
					</DialogHeader>

					<Separator />

					{selectedBooking && (
						<>
							<div className='grid md:grid-cols-2 gap-x-8 gap-y-6 py-4'>
								<div className='space-y-4'>
									<h3 className='font-semibold text-lg border-b pb-2'>
										Customer & Vehicle
									</h3>
									<DetailItem
										icon={User}
										label='Customer'
										value={selectedBooking.evOwnerName}
									/>
									<DetailItem
										icon={Car}
										label='Vehicle'
										value={selectedBooking.vehicleInfo || 'Not specified'}
									/>
								</div>

								<div className='space-y-4'>
									<h3 className='font-semibold text-lg border-b pb-2'>
										Booking Schedule
									</h3>
									<DetailItem
										icon={Calendar}
										label='Date'
										value={format(
											new Date(selectedBooking.bookingDate),
											'EEEE, MMM dd, yyyy',
										)}
									/>
									<DetailItem
										icon={Clock}
										label='Time Slot'
										value={`${selectedBooking.timeSlot.startTime} - ${selectedBooking.timeSlot.endTime}`}
									/>
								</div>

								<div className='space-y-4 md:col-span-2'>
									<h3 className='font-semibold text-lg border-b pb-2'>
										Station Details
									</h3>
									<DetailItem
										icon={Info}
										label='Station'
										value={selectedBooking.stationName}
									/>
									<DetailItem
										icon={MapPin}
										label='Address'
										value={selectedBooking.stationAddress}
									/>
								</div>

								{selectedBooking.notes && (
									<div className='md:col-span-2'>
										<DetailItem
											icon={MessageSquare}
											label='Customer Notes'
											value={selectedBooking.notes}
											isBlock
										/>
									</div>
								)}

								{selectedBooking.cancellationReason && (
									<div className='md:col-span-2'>
										<p className='text-sm font-medium text-destructive-foreground flex items-center gap-2 mb-2'>
											<Info className='h-4 w-4' />
											Cancellation Reason
										</p>
										<p className='text-sm p-3 bg-destructive/10 text-destructive rounded-md border border-destructive/20'>
											{selectedBooking.cancellationReason}
										</p>
									</div>
								)}
							</div>

							<Separator />

							<DialogFooter className='gap-3'>
								{selectedBooking.status === BookingStatus.Pending && (
									<>
										<Button
											variant='destructive'
											onClick={() => handleCancel(selectedBooking.id)}
										>
											<X className='h-4 w-4 mr-2' /> Reject
										</Button>
										<Button
											onClick={() => handleApprove(selectedBooking.id)}
											className='bg-green-600 hover:bg-green-700'
										>
											<Check className='h-4 w-4 mr-2' /> Approve
										</Button>
									</>
								)}
								{selectedBooking.status === BookingStatus.Approved && (
									<>
										<Button
											variant='destructive'
											onClick={() => handleCancel(selectedBooking.id)}
										>
											<X className='h-4 w-4 mr-2' /> Cancel
										</Button>
										<Button
											onClick={() => handleComplete(selectedBooking.id)}
											className='bg-blue-600 hover:bg-blue-700'
										>
											<BookmarkCheck className='h-4 w-4 mr-2' /> Complete
										</Button>
									</>
								)}
								{(selectedBooking.status === BookingStatus.Completed ||
									selectedBooking.status === BookingStatus.Cancelled) && (
									<Button variant='secondary' onClick={handleCloseCard}>
										Close
									</Button>
								)}
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

function DetailItem({
	icon: Icon,
	label,
	value,
	isBlock = false,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
	isBlock?: boolean;
}) {
	return (
		<div>
			<p className='text-sm text-muted-foreground flex items-center gap-2 mb-1'>
				<Icon className='h-4 w-4' />
				{label}
			</p>
			<p
				className={cn(
					'font-medium',
					isBlock && 'text-sm p-3 bg-secondary/50 rounded-md border',
				)}
			>
				{value}
			</p>
		</div>
	);
}
