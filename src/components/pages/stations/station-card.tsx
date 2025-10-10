import { Clock, MapPin, MoreVertical, Plug } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth/use-auth';
import {
	useDeleteStation,
	useUpdateStationStatus,
} from '@/queries/station.queries';
import type { IStation } from '@/types/station';
import type { IUserProfile } from '@/types/user';

import { EditStationDialog } from './edit-station-dialog';

interface StationCardProps {
	station: IStation;
}

export function StationCard({ station }: StationCardProps) {
	const { user } = useAuth();
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const updateStatusMutation = useUpdateStationStatus();
	const deleteStationMutation = useDeleteStation();

	const userProfile = user as IUserProfile;
	const isBackoffice = userProfile?.role === 'backOffice';
	const isOperator =
		userProfile?.role === 'operator' && userProfile?.id === station.operatorId;
	const canEdit = isBackoffice || isOperator;

	const handleToggleStatus = () => {
		updateStatusMutation.mutate({
			id: station.id,
			data: { isActive: !station.isActive },
		});
	};

	const handleDeleteConfirm = () => {
		deleteStationMutation.mutate(station.id);
		setIsDeleteDialogOpen(false);
	};

	const handleDelete = () => {
		setIsDeleteDialogOpen(true);
	};

	const availabilityPercentage =
		station.totalSlots > 0
			? (station.availableSlots / station.totalSlots) * 100
			: 0;

	const getAvailabilityColor = () => {
		if (availabilityPercentage >= 50) return 'bg-green-500';
		if (availabilityPercentage >= 25) return 'bg-yellow-500';
		return 'bg-red-500';
	};

	// Get the first schedule entry for display
	const scheduleInfo = station.schedule?.[0];
	const operatingHours = scheduleInfo
		? `${scheduleInfo.openTime} - ${scheduleInfo.closeTime}`
		: 'Hours not set';

	return (
		<>
			<Card className='flex flex-col transition-shadow hover:shadow-md'>
				<CardHeader className='flex-row items-start justify-between space-y-0 pb-4'>
					<div className='flex-1 space-y-1'>
						<h3 className='font-semibold leading-none'>{station.name}</h3>
						<p className='text-muted-foreground flex items-center gap-1 text-sm'>
							<MapPin className='h-3 w-3' />
							{station.type || 'Charging Station'}
						</p>
					</div>
					<div className='flex items-center gap-2'>
						<Badge variant={station.isActive ? 'default' : 'secondary'}>
							{station.isActive ? 'Active' : 'Inactive'}
						</Badge>
						{canEdit && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='icon' className='h-8 w-8'>
										<MoreVertical className='h-4 w-4' />
										<span className='sr-only'>Open menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
										Edit Details
									</DropdownMenuItem>
									{isBackoffice && (
										<DropdownMenuItem onClick={handleToggleStatus}>
											{station.isActive ? 'Deactivate' : 'Activate'}
										</DropdownMenuItem>
									)}
									{isBackoffice && (
										<>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={handleDelete}
												className='text-destructive'
											>
												Delete Station
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</CardHeader>

				<CardContent className='flex-1 space-y-4'>
					<div className='space-y-2'>
						<div className='flex items-center justify-between text-sm'>
							<span className='text-muted-foreground'>Availability</span>
							<span className='font-medium'>
								{station.availableSlots}/{station.totalSlots} slots
							</span>
						</div>
						<div className='h-2 w-full overflow-hidden rounded-full bg-secondary'>
							<div
								className={`h-full transition-all ${getAvailabilityColor()}`}
								style={{ width: `${availabilityPercentage}%` }}
							/>
						</div>
					</div>

					<div className='space-y-2 text-sm'>
						<div className='flex items-center gap-2'>
							<Clock className='text-muted-foreground h-4 w-4' />
							<span>{operatingHours}</span>
						</div>
						<div className='flex items-center gap-2'>
							<Plug className='text-muted-foreground h-4 w-4' />
							<span>{station.totalSlots} charging points</span>
						</div>
					</div>

					{station.address && (
						<div className='text-muted-foreground truncate text-xs'>
							{station.address}
						</div>
					)}
				</CardContent>

				<CardFooter>
					<Button variant='outline' className='w-full'>
						View Details
					</Button>
				</CardFooter>
			</Card>

			{isEditDialogOpen && (
				<EditStationDialog
					station={station}
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
				/>
			)}

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action will permanently delete the station "{station.name}".
							This action cannot be undone and may affect existing bookings.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className='bg-destructive hover:bg-destructive/90'
							onClick={handleDeleteConfirm}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
