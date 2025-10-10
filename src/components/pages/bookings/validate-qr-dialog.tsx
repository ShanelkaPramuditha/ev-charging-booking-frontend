import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';

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
import { useValidateQRCode } from '@/queries/booking.queries';
import {
	qrValidationSchema,
	type QRValidationFormData,
} from '@/schemas/booking.schema';

interface ValidateQRDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ValidateQRDialog({
	open,
	onOpenChange,
}: ValidateQRDialogProps) {
	const { mutate: validate, isPending, data } = useValidateQRCode();

	const form = useForm<QRValidationFormData>({
		resolver: zodResolver(qrValidationSchema),
		defaultValues: { qrCode: '' },
	});

	const onSubmit = (values: QRValidationFormData) => {
		validate(values, {
			onSuccess: () => {
				// keep dialog open to show result
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Search className='h-5 w-5' /> Validate Booking QR
					</DialogTitle>
					<DialogDescription>
						Paste or enter the booking QR string to validate and view booking
						details.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='qrCode'
							render={({ field }) => (
								<FormItem>
									<FormLabel>QR Code</FormLabel>
									<FormControl>
										<Input placeholder='Paste QR code here' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{data && (
							<div className='rounded-md border p-3'>
								<p className='font-medium'>
									Result: {data.isValid ? 'Valid' : 'Invalid'}
								</p>
								{data.booking && (
									<div className='mt-2 text-sm text-muted-foreground'>
										<p>
											<strong>Station:</strong> {data.booking.stationName}
										</p>
										<p>
											<strong>Date:</strong>{' '}
											{new Date(data.booking.bookingDate).toLocaleString()}
										</p>
										<p>
											<strong>Status:</strong> {data.booking.status}
										</p>
									</div>
								)}
							</div>
						)}

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
								{isPending ? 'Validating...' : 'Validate'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
