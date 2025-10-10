import { useNavigate, useParams } from '@tanstack/react-router';
import {
	ArrowLeft,
	Calendar,
	Clock,
	MapPin,
	Phone,
	Plug,
	User,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { OSMMapPicker } from '@/components/ui/osm-map-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth/use-auth';
import { cn } from '@/lib/utils';
import { useStation } from '@/queries/station.queries';
import type { IUserProfile } from '@/types/user';

import { ManageScheduleDialog } from './manage-schedule-dialog';
import { ManageSlotsDialog } from './manage-slots-dialog';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function StationDetailsPage() {
	const { stationId } = useParams({
		from: '/_authenticated/stations/$stationId/',
	});
	const navigate = useNavigate();
	const { user } = useAuth();
	const { data: station, isLoading } = useStation(stationId);
	const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
	const [slotsDialogOpen, setSlotsDialogOpen] = useState(false);

	const userProfile = user as IUserProfile;
	const isBackoffice = userProfile?.role === 'backOffice';
	const isOperator =
		userProfile?.role === 'operator' &&
		station &&
		userProfile?.id === station.operatorId;
	const canEdit = isBackoffice;
	const canEditSlots = isBackoffice || isOperator;

	const handleBack = () => {
		navigate({ to: '/stations' });
	};

	const handleEdit = () => {
		navigate({
			to: '/stations/$stationId/edit',
			params: { stationId },
		});
	};

	if (isLoading) {
		return (
			<div className='container mx-auto py-6'>
				<Button variant='ghost' size='sm' className='mb-4' onClick={handleBack}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Stations
				</Button>
				<div className='space-y-6'>
					<Skeleton className='h-20 w-full' />
					<div className='grid gap-6 md:grid-cols-2'>
						<Skeleton className='h-96' />
						<Skeleton className='h-96' />
					</div>
				</div>
			</div>
		);
	}

	if (!station) {
		return (
			<div className='container mx-auto flex min-h-[400px] items-center justify-center py-6'>
				<div className='text-center'>
					<p className='text-muted-foreground mb-4'>Station not found</p>
					<Button onClick={handleBack}>Back to Stations</Button>
				</div>
			</div>
		);
	}

	const availabilityPercentage =
		station.totalSlots > 0
			? (station.availableSlots / station.totalSlots) * 100
			: 0;

	const getAvailabilityColor = () => {
		if (availabilityPercentage >= 50) return 'text-green-500';
		if (availabilityPercentage >= 25) return 'text-yellow-500';
		return 'text-red-500';
	};

	return (
		<div className='container mx-auto py-6'>
			{/* Header */}
			<div className='mb-6'>
				<Button variant='ghost' size='sm' onClick={handleBack} className='mb-4'>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Stations
				</Button>
				<div className='flex items-start justify-between'>
					<div>
						<h1 className='text-3xl font-bold'>{station.name}</h1>
						<p className='text-muted-foreground mt-2 flex items-center gap-2'>
							<MapPin className='h-4 w-4' />
							{station.address}
						</p>
					</div>
					<div className='flex items-center gap-3'>
						<Badge
							variant={station.isActive ? 'default' : 'secondary'}
							className={cn(
								'text-base px-3 py-1',
								station.isActive
									? 'bg-green-100 text-green-800'
									: 'bg-red-100 text-red-800',
							)}
						>
							{station.isActive ? 'Active' : 'Inactive'}
						</Badge>
						{canEdit && <Button onClick={handleEdit}>Edit Station</Button>}
					</div>
				</div>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				{/* Station Information */}
				<div className='space-y-6'>
					{/* Basic Info */}
					<Card>
						<CardHeader>
							<CardTitle>Station Information</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<span className='text-muted-foreground'>Type</span>
								<Badge variant='outline'>{station.type}</Badge>
							</div>

							<div className='flex items-center justify-between'>
								<span className='text-muted-foreground'>Total Slots</span>
								<span className='flex items-center gap-2 font-semibold'>
									<Plug className='h-4 w-4' />
									{station.totalSlots}
								</span>
							</div>

							<div className='flex items-center justify-between'>
								<span className='text-muted-foreground'>Available Slots</span>
								<span className={`font-semibold ${getAvailabilityColor()}`}>
									{station.availableSlots} ({availabilityPercentage.toFixed(0)}
									%)
								</span>
							</div>

							{station.contactPhone && (
								<div className='flex items-center justify-between'>
									<span className='text-muted-foreground'>Contact</span>
									<span className='flex items-center gap-2'>
										<Phone className='h-4 w-4' />
										{station.contactPhone}
									</span>
								</div>
							)}

							{station.operator && (
								<div className='flex items-center justify-between'>
									<span className='text-muted-foreground'>Operator</span>
									<span className='flex items-center gap-2'>
										<User className='h-4 w-4' />
										{station.operator.username}
									</span>
								</div>
							)}

							<div className='flex items-center justify-between'>
								<span className='text-muted-foreground'>Location</span>
								<span className='text-muted-foreground text-sm'>
									{station.location.latitude.toFixed(4)}°N,{' '}
									{station.location.longitude.toFixed(4)}°E
								</span>
							</div>
						</CardContent>
					</Card>

					{/* Schedule */}
					<Card>
						<CardHeader>
							<div className='flex flex-col gap-2'>
								<div>
									<CardTitle className='flex items-center gap-2'>
										<Calendar className='h-5 w-5' />
										Operating Schedule
									</CardTitle>
									<CardDescription>
										Weekly operating hours for this station
									</CardDescription>
								</div>
								{canEditSlots && (
									<div className='flex gap-4'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => setScheduleDialogOpen(true)}
										>
											<Clock className='mr-2 h-4 w-4' />
											Manage Schedule
										</Button>

										<Button
											variant='outline'
											size='sm'
											onClick={() => setSlotsDialogOpen(true)}
										>
											<Plug className='mr-2 h-4 w-4' />
											Manage Slots
										</Button>
									</div>
								)}
							</div>
						</CardHeader>
						<CardContent>
							{station.schedule && station.schedule.length > 0 ? (
								<div className='space-y-3'>
									{DAYS.map((day, index) => {
										const daySchedule = station.schedule.find(
											(s) => s.dayOfWeek === index + 1,
										);
										return (
											<div
												key={index}
												className='flex items-center justify-between border-b pb-2 last:border-0'
											>
												<span className='font-medium'>{day}</span>
												{daySchedule && daySchedule.isOpen ? (
													<span className='text-muted-foreground flex items-center gap-2 text-sm'>
														<Clock className='h-3 w-3' />
														{daySchedule.openTime} - {daySchedule.closeTime}
													</span>
												) : (
													<Badge variant='secondary'>Closed</Badge>
												)}
											</div>
										);
									})}
								</div>
							) : (
								<p className='text-muted-foreground text-sm'>
									No schedule information available
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Map */}
				<div className='relative z-0'>
					<Card className='h-full relative z-0'>
						<CardHeader>
							<CardTitle>Location</CardTitle>
							<CardDescription>Station location on the map</CardDescription>
						</CardHeader>
						<CardContent className='relative z-0'>
							<div className='relative z-0'>
								<OSMMapPicker
									latitude={station.location.latitude}
									longitude={station.location.longitude}
									onLocationChange={() => {
										// Read-only map, no changes allowed
									}}
									className='pointer-events-none'
								/>
							</div>
							<p className='text-muted-foreground mt-2 text-sm'>
								{station.address}
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Schedule Management Dialog */}
			{station && (
				<>
					<ManageScheduleDialog
						open={scheduleDialogOpen}
						onOpenChange={setScheduleDialogOpen}
						stationId={stationId}
						currentSchedule={station.schedule || []}
					/>
					<ManageSlotsDialog
						open={slotsDialogOpen}
						onOpenChange={setSlotsDialogOpen}
						stationId={stationId}
						currentSlots={station.availableSlots}
					/>
				</>
			)}
		</div>
	);
}
