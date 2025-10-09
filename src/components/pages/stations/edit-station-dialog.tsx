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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUpdateStation } from '@/queries/station.queries';
import {
	type UpdateStationFormData,
	updateStationSchema,
} from '@/schemas/station.schema';
import type { IStation } from '@/types/station';

interface EditStationDialogProps {
	station: IStation;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditStationDialog({
	station,
	open,
	onOpenChange,
}: EditStationDialogProps) {
	const updateMutation = useUpdateStation();

	const form = useForm<UpdateStationFormData>({
		resolver: zodResolver(updateStationSchema),
		defaultValues: {
			name: station.name,
			type: station.type as 'DC Fast Charger' | 'AC Charger',
			address: station.address,
			location: {
				latitude: station.location.latitude,
				longitude: station.location.longitude,
			},
			totalSlots: station.totalSlots,
			contactPhone: station.contactPhone || '',
		},
	});

	const handleSubmit = (data: UpdateStationFormData) => {
		updateMutation.mutate(
			{ id: station.id, data },
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Edit Station</DialogTitle>
					<DialogDescription>
						Update station details and information
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-6'
					>
						{/* Basic Info */}
						<div className='space-y-4'>
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
						</div>

						{/* Station Details */}
						<div className='space-y-4'>
							<h3 className='font-semibold'>Station Details</h3>

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
										<FormMessage />
									</FormItem>
								)}
							/>

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
								name='contactPhone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contact Phone</FormLabel>
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
						</div>

						{/* Location */}
						<div className='space-y-4'>
							<h3 className='font-semibold'>Location Coordinates</h3>
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
													value={field.value || ''}
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
						</div>

						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
								disabled={updateMutation.isPending}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={updateMutation.isPending}>
								{updateMutation.isPending ? 'Saving...' : 'Save Changes'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
