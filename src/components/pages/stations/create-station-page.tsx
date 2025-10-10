import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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
import { OSMMapPicker } from '@/components/ui/osm-map-picker';
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

export function CreateStationPage() {
	const navigate = useNavigate();
	const createMutation = useCreateStation();
	const { data: users } = useUsers();
	const [mapLocation, setMapLocation] = useState({
		lat: 6.9271, // Default to Colombo
		lng: 79.8612,
	});

	// Filter operators from users list
	const operators = users?.filter((user) => user.role === 'operator') || [];

	const form = useForm<CreateStationFormData>({
		resolver: zodResolver(createStationSchema),
		defaultValues: {
			name: '',
			operatorId: '',
			location: {
				latitude: mapLocation.lat,
				longitude: mapLocation.lng,
			},
			type: 'DC Fast Charger',
			totalSlots: 4,
			address: '',
			contactPhone: '',
			schedule: DAYS_OF_WEEK.map((_, index) => ({
				dayOfWeek: index + 1,
				openTime: '08:00',
				closeTime: '20:00',
				isOpen: true,
			})),
		},
	});

	const handleSubmit = async (data: CreateStationFormData) => {
		try {
			await createMutation.mutateAsync(data);
			toast.success('Station created successfully');
			navigate({ to: '/stations' });
		} catch (error) {
			console.error('Error creating station:', error);
			toast.error('Failed to create station');
		}
	};

	const handleMapLocationChange = (lat: number, lng: number) => {
		setMapLocation({ lat, lng });
		form.setValue('location.latitude', lat);
		form.setValue('location.longitude', lng);
	};

	const handleCancel = () => {
		navigate({ to: '/stations' });
	};

	return (
		<div className='container mx-auto py-6'>
			<div className='mb-6'>
				<Button
					variant='ghost'
					size='sm'
					onClick={handleCancel}
					className='mb-4'
				>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Stations
				</Button>
				<div>
					<h1 className='text-3xl font-bold'>Create New Station</h1>
					<p className='text-muted-foreground mt-2'>
						Add a new charging station to the system
					</p>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
							<CardDescription>
								Enter the basic details of the charging station
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
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

							<FormField
								control={form.control}
								name='type'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Charger Type</FormLabel>
										<FormControl>
											<select
												className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
												{...field}
											>
												<option value='DC Fast Charger'>DC Fast Charger</option>
												<option value='AC Charger'>AC Charger</option>
											</select>
										</FormControl>
										<FormDescription>
											Select the type of charging technology
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='totalSlots'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Total Charging Slots</FormLabel>
										<FormControl>
											<Input
												type='number'
												min='1'
												{...field}
												onChange={(e) =>
													field.onChange(parseInt(e.target.value, 10))
												}
											/>
										</FormControl>
										<FormDescription>
											Number of charging points available at this station
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Location Information */}
					<Card>
						<CardHeader>
							<CardTitle>Location Information</CardTitle>
							<CardDescription>
								Set the location of the charging station
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
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
							<div className='space-y-2'>
								<label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
									Select Location on Map
								</label>
								<OSMMapPicker
									latitude={mapLocation.lat}
									longitude={mapLocation.lng}
									onLocationChange={handleMapLocationChange}
								/>
							</div>{' '}
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
													value={field.value || ''}
													onChange={(e) => {
														const val = parseFloat(e.target.value);
														field.onChange(val);
														setMapLocation((prev) => ({ ...prev, lat: val }));
													}}
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
													value={field.value || ''}
													onChange={(e) => {
														const val = parseFloat(e.target.value);
														field.onChange(val);
														setMapLocation((prev) => ({ ...prev, lng: val }));
													}}
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
											<Input
												placeholder='0771234567'
												maxLength={10}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Schedule Information */}
					<Card>
						<CardHeader>
							<CardTitle>Operating Schedule</CardTitle>
							<CardDescription>
								Default schedule will be created for all days (08:00 - 20:00).
								You can customize it after creation.
							</CardDescription>
						</CardHeader>
					</Card>

					{/* Action Buttons */}
					<div className='flex justify-end gap-4'>
						<Button
							type='button'
							variant='outline'
							onClick={handleCancel}
							disabled={createMutation.isPending}
						>
							Cancel
						</Button>
						<Button type='submit' disabled={createMutation.isPending}>
							{createMutation.isPending ? 'Creating...' : 'Create Station'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
