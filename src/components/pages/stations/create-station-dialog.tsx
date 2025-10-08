import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateStation } from '@/queries/station.queries';
import { useUsers } from '@/queries/user.queries';
import {
	type CreateStationFormData,
	createStationSchema,
} from '@/schemas/station.schema';

const DAYS_OF_WEEK = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
];

interface CreateStationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateStationDialog({
	open,
	onOpenChange,
}: CreateStationDialogProps) {
	const createMutation = useCreateStation();
	const { data: users } = useUsers();

	// Filter operators from users list
	const operators = users?.filter((user) => user.role === 'operator') || [];

	const form = useForm<CreateStationFormData>({
		resolver: zodResolver(createStationSchema),
		defaultValues: {
			name: '',
			operatorId: '',
			location: {
				latitude: 0,
				longitude: 0,
			},
			type: 'DC Fast Charger',
			totalSlots: 4,
			address: '',
			contactPhone: '',
			pricePerHour: 5.0,
			schedule: DAYS_OF_WEEK.map((_, index) => ({
				dayOfWeek: index + 1,
				openTime: '08:00',
				closeTime: '20:00',
				isOpen: true,
			})),
		},
	});

	const handleSubmit = (data: CreateStationFormData) => {
		createMutation.mutate(data, {
			onSuccess: () => {
				form.reset();
				onOpenChange(false);
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Create New Station</DialogTitle>
					<DialogDescription>
						Add a new charging station to the system
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-6'
					>
						{/* Basic Info */}
						<div className='space-y-4'>
							<h3 className='font-semibold'>Basic Information</h3>
							<div className='grid gap-4 sm:grid-cols-2'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Station Name</FormLabel>
											<FormControl>
												<Input placeholder='Downtown Charging Hub' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='operatorId'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Operator</FormLabel>
											<FormControl>
												<select
													className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
													{...field}
												>
													<option value=''>Select operator</option>
													{operators.map((operator) => (
														<option key={operator.id} value={operator.id}>
															{operator.username} ({operator.email})
														</option>
													))}
												</select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Location */}
						<div className='space-y-4'>
							<h3 className='font-semibold'>Location</h3>
							<div className='space-y-4'>
								<FormField
									control={form.control}
									name='address'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address</FormLabel>
											<FormControl>
												<Input
													placeholder='123 Galle Road, Colombo 03, Sri Lanka'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='type'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Station Type</FormLabel>
											<FormControl>
												<select
													className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
													{...field}
												>
													<option value='DC Fast Charger'>
														DC Fast Charger
													</option>
													<option value='AC Charger'>AC Charger</option>
													<option value='Level 2 Charger'>
														Level 2 Charger
													</option>
													<option value='Supercharger'>Supercharger</option>
												</select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='grid gap-4 sm:grid-cols-2'>
									<FormField
										control={form.control}
										name='location.latitude'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Latitude</FormLabel>
												<FormControl>
													<Input
														type='number'
														step='any'
														placeholder='6.9271'
														{...field}
														onChange={(e) =>
															field.onChange(parseFloat(e.target.value))
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='location.longitude'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Longitude</FormLabel>
												<FormControl>
													<Input
														type='number'
														step='any'
														placeholder='79.8612'
														{...field}
														onChange={(e) =>
															field.onChange(parseFloat(e.target.value))
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name='contactPhone'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Contact Phone (Optional)</FormLabel>
											<FormControl>
												<Input placeholder='+94 77 123 4567' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Pricing & Capacity */}
						<div className='space-y-4'>
							<h3 className='font-semibold'>Pricing & Capacity</h3>
							<div className='grid gap-4 sm:grid-cols-2'>
								<FormField
									control={form.control}
									name='totalSlots'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Total Charging Slots</FormLabel>
											<FormControl>
												<Input type='number' min='1' {...field} />
											</FormControl>
											<FormDescription>
												Number of charging points available
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='pricePerHour'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price per Hour ($)</FormLabel>
											<FormControl>
												<Input type='number' min='0' step='0.01' {...field} />
											</FormControl>
											<FormDescription>Hourly charging rate</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Schedule */}
						<div className='space-y-4'>
							<h3 className='font-semibold'>Operating Schedule</h3>
							<p className='text-muted-foreground text-sm'>
								Default schedule will be created for all days (08:00 - 20:00).
								You can customize it after creation.
							</p>
						</div>

						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
								disabled={createMutation.isPending}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={createMutation.isPending}>
								{createMutation.isPending ? 'Creating...' : 'Create Station'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
