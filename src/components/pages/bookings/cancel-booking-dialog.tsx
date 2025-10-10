import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useCancelBooking } from '@/queries/booking.queries';
import { cancelBookingSchema, type CancelBookingFormData } from '@/schemas/booking.schema';

interface CancelBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bookingId: string;
}

export function CancelBookingDialog({ open, onOpenChange, bookingId }: CancelBookingDialogProps) {
    const { mutate: cancelBooking, isPending } = useCancelBooking();

    const form = useForm<CancelBookingFormData>({
        resolver: zodResolver(cancelBookingSchema),
        defaultValues: { cancellationReason: '' },
    });

    const onSubmit = (data: CancelBookingFormData) => {
        cancelBooking(
            { id: bookingId, data },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Trash className='h-5 w-5 text-destructive' /> Cancel Booking
                    </DialogTitle>
                    <DialogDescription>
                        Cancelling a booking will mark it as cancelled. Operators and Backoffice can cancel a booking at any time.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='cancellationReason'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason for cancellation</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='Provide a brief reason (min 10 chars)' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button variant='outline' type='button' onClick={() => onOpenChange(false)} disabled={isPending}>
                                Close
                            </Button>
                            <Button type='submit' className='text-destructive' disabled={isPending}>
                                {isPending ? 'Cancelling...' : 'Cancel Booking'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
