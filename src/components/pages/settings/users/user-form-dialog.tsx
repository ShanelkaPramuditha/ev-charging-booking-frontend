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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
	type CreateUserFormData,
	createUserSchema,
} from '@/schemas/user.schema';
import type { IUserProfile } from '@/types/user';

interface UserFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: CreateUserFormData) => void;
	isLoading?: boolean;
	user?: IUserProfile | null;
}

export function UserFormDialog({
	open,
	onOpenChange,
	onSubmit,
	isLoading = false,
	user,
}: UserFormDialogProps) {
	const isEdit = !!user;

	const form = useForm<CreateUserFormData>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			username: user?.username || '',
			email: user?.email || '',
			role: user?.role || 'evOwner',
			password: '',
			phoneNumber: user?.phoneNumber || '',
			address: user?.address || '',
		},
	});

	const handleSubmit = (data: CreateUserFormData) => {
		onSubmit(data);
		form.reset();
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle>{isEdit ? 'Edit User' : 'Create New User'}</DialogTitle>
					<DialogDescription>
						{isEdit
							? 'Update user information below.'
							: 'Fill in the information below to create a new user.'}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-4'
					>
						{/* Username */}
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder='John Doe' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Email */}
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='john@example.com'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Role */}
						<FormField
							control={form.control}
							name='role'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a role' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='backOffice'>Back Office</SelectItem>
											<SelectItem value='operator'>Operator</SelectItem>
											<SelectItem value='evOwner'>EV Owner</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										Select the user&apos;s role in the system.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password */}
						{!isEdit && (
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type='password'
												placeholder='Enter password'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Minimum 6 characters required.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{/* Phone Number */}
						<FormField
							control={form.control}
							name='phoneNumber'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number (Optional)</FormLabel>
									<FormControl>
										<Input placeholder='+1234567890' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Address */}
						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address (Optional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Enter address'
											className='resize-none'
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
								onClick={handleClose}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={isLoading}>
								{isLoading
									? 'Saving...'
									: isEdit
										? 'Update User'
										: 'Create User'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
