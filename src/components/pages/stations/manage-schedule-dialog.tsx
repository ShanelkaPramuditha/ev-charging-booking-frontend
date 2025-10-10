import { zodResolver } from '@hookform/resolvers/zod';
import { Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useUpdateStationSchedule } from '@/queries/station.queries';
import {
	type UpdateScheduleFormData,
	updateScheduleSchema,
} from '@/schemas/station.schema';
import type { IStationSchedule } from '@/types/station';

interface ManageScheduleDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	stationId: string;
	currentSchedule: IStationSchedule[];
}

const DAYS = [
	{ label: 'Monday', value: 1 },
	{ label: 'Tuesday', value: 2 },
	{ label: 'Wednesday', value: 3 },
	{ label: 'Thursday', value: 4 },
	{ label: 'Friday', value: 5 },
	{ label: 'Saturday', value: 6 },
	{ label: 'Sunday', value: 7 },
];

export function ManageScheduleDialog({
	open,
	onOpenChange,
	stationId,
	currentSchedule,
}: ManageScheduleDialogProps) {
	const { mutate: updateSchedule, isPending } = useUpdateStationSchedule();

	const form = useForm<UpdateScheduleFormData>({
		resolver: zodResolver(updateScheduleSchema),
		defaultValues: {
			schedule:
				currentSchedule.length > 0
					? currentSchedule
					: DAYS.map((day) => ({
							dayOfWeek: day.value,
							openTime: '08:00',
							closeTime: '20:00',
							isOpen: true,
						})),
		},
	});

	const onSubmit = (data: UpdateScheduleFormData) => {
		updateSchedule(
			{ id: stationId, data },
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			},
		);
	};

	const handleApplyToAll = () => {
		const firstDay = form.getValues('schedule.0');
		if (firstDay) {
			const scheduleValues = DAYS.map((day) => ({
				dayOfWeek: day.value,
				openTime: firstDay.openTime,
				closeTime: firstDay.closeTime,
				isOpen: firstDay.isOpen,
			}));
			form.setValue('schedule', scheduleValues);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Clock className='h-5 w-5' />
						Manage Operating Schedule
					</DialogTitle>
					<DialogDescription>
						Set the operating hours for each day of the week. Toggle days on/off
						to mark them as open or closed.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<div className='flex justify-end'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={handleApplyToAll}
							>
								Apply Monday to All Days
							</Button>
						</div>

						<div className='space-y-4'>
							{DAYS.map((day, index) => (
								<div
									key={day.value}
									className='rounded-lg border p-4 space-y-3'
								>
									<div className='flex items-center justify-between'>
										<h4 className='font-semibold'>{day.label}</h4>
										<FormField
											control={form.control}
											name={`schedule.${index}.isOpen`}
											render={({ field }) => (
												<FormItem className='flex items-center space-x-2 space-y-0'>
													<FormLabel className='text-sm text-muted-foreground'>
														Open
													</FormLabel>
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>

									{form.watch(`schedule.${index}.isOpen`) && (
										<div className='grid grid-cols-2 gap-4'>
											<FormField
												control={form.control}
												name={`schedule.${index}.openTime`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Opening Time</FormLabel>
														<FormControl>
															<Input
																type='time'
																{...field}
																className='w-full'
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name={`schedule.${index}.closeTime`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Closing Time</FormLabel>
														<FormControl>
															<Input
																type='time'
																{...field}
																className='w-full'
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									)}

									{/* Hidden field for dayOfWeek */}
									<FormField
										control={form.control}
										name={`schedule.${index}.dayOfWeek`}
										render={({ field }) => (
											<input type='hidden' {...field} value={day.value} />
										)}
									/>
								</div>
							))}
						</div>

						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={isPending}>
								{isPending ? 'Saving...' : 'Save Schedule'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
