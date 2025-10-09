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
import { Textarea } from '@/components/ui/textarea';
import { useCreateBooking } from '@/queries/booking.queries';
import { useStations } from '@/queries/station.queries';
import {
	type CreateBookingFormData,
	createBookingSchema,
} from '@/schemas/booking.schema';

interface CreateBookingDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateBookingDialog({
	open,
	onOpenChange,
}: CreateBookingDialogProps) {
	const createMutation = useCreateBooking();
	const { data: stations } = useStations();

	const form = useForm<CreateBookingFormData>({
		resolver: zodResolver(createBookingSchema),
		defaultValues: {
			stationId: '',
			bookingDate: '',
			timeSlot: {
				startTime: '',
				endTime: '',
			},
			vehicleInfo: '',
			notes: '',
		},
	});

	const handleSubmit = (data: CreateBookingFormData) => {
		createMutation.mutate(data, {
			onSuccess: () => {
				form.reset();
				onOpenChange(false);
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>Create Booking</DialogTitle>
					<DialogDescription>
						Book a charging station for your electric vehicle
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='stationId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Station</FormLabel>
									<FormControl>
										<select
											className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
											{...field}
										>
											<option value=''>Select a station</option>
											{stations?.map((station) => (
												<option key={station.id} value={station.id}>
													{station.name} - {station.address}
												</option>
											))}
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='bookingDate'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<Input type='date' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='timeSlot.startTime'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Time</FormLabel>
										<FormControl>
											<Input type='time' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='timeSlot.endTime'
								render={({ field }) => (
									<FormItem>
										<FormLabel>End Time</FormLabel>
										<FormControl>
											<Input type='time' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name='vehicleInfo'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Vehicle Info (Optional)</FormLabel>
									<FormControl>
										<Input placeholder='Tesla Model 3' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='notes'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notes (Optional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Any special requirements...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
								{createMutation.isPending ? 'Creating...' : 'Create Booking'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
