import { useForm } from 'react-hook-form';
import { Plug } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
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
import { useUpdateStationSlots } from '@/queries/station.queries';
import type { UpdateStationSlotsRequest } from '@/types/station';

interface ManageSlotsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	stationId: string;
	currentSlots: number;
}

export function ManageSlotsDialog({
	open,
	onOpenChange,
	stationId,
	currentSlots,
}: ManageSlotsDialogProps) {
	const { mutate: updateSlots, isPending } = useUpdateStationSlots();

	const form = useForm<UpdateStationSlotsRequest>({
		defaultValues: { availableSlots: currentSlots },
	});

	const onSubmit = (data: UpdateStationSlotsRequest) => {
		updateSlots(
			{ id: stationId, data },
			{ onSuccess: () => onOpenChange(false) },
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Plug className='h-5 w-5' /> Update Available Slots
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='availableSlots'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Available Slots</FormLabel>
									<FormControl>
										<Input type='number' min={0} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								variant='outline'
								type='button'
								onClick={() => onOpenChange(false)}
								disabled={isPending}
							>
								Close
							</Button>
							<Button type='submit' disabled={isPending}>
								{isPending ? 'Saving...' : 'Save'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
