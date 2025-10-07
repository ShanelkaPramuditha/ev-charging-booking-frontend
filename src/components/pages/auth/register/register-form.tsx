import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { Building2, User } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRegisterMutation } from '@/queries/auth.queries';
import { type RegisterFormData, registerSchema } from '@/schemas/auth.schema';

export function RegisterForm({
	className,
	...props
}: React.ComponentProps<'form'>) {
	const registerMutation = useRegisterMutation();

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: '',
			email: '',
			role: 'backOffice',
			password: '',
			confirmPassword: '',
		},
	});

	const handleSubmit = (data: RegisterFormData) => {
		registerMutation.mutate({
			username: data.username,
			email: data.email,
			password: data.password,
			role: data.role,
		});
	};

	const roleOptions = [
		{
			value: 'backOffice' as const,
			label: 'BackOffice User',
			description: 'For office staff and administrators',
			icon: Building2,
		},
		{
			value: 'operator' as const,
			label: 'Operator',
			description: 'For charging station operators',
			icon: User,
		},
		// {
		// 	value: 'evOwner' as const,
		// 	label: 'EV Owner',
		// 	description: 'For electric vehicle owners',
		// 	icon: CarFront,
		// },
	];

	return (
		<Form {...form}>
			<form
				className={cn('flex flex-col gap-6', className)}
				onSubmit={form.handleSubmit(handleSubmit)}
				{...props}
			>
				<div className='flex flex-col items-center gap-2 text-center'>
					<h1 className='text-2xl font-bold'>Create an account</h1>
					<p className='text-muted-foreground text-sm text-balance'>
						Enter your details below to create your account
					</p>
				</div>
				<div className='grid gap-6'>
					{registerMutation.isError && (
						<div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3'>
							{registerMutation.error?.message || 'Registration failed'}
						</div>
					)}

					{/* Role Selection */}
					<FormField
						control={form.control}
						name='role'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Select Account Type</FormLabel>
								<FormControl>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
										{roleOptions.map((option) => {
											const Icon = option.icon;
											const isSelected = field.value === option.value;
											return (
												<button
													key={option.value}
													type='button'
													onClick={() => field.onChange(option.value)}
													disabled={registerMutation.isPending}
													className={cn(
														'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
														'hover:border-primary/50 hover:bg-accent/50',
														'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
														'disabled:opacity-50 disabled:cursor-not-allowed',
														isSelected
															? 'border-primary bg-accent shadow-sm'
															: 'border-border bg-background',
													)}
												>
													<Icon
														className={cn(
															'h-8 w-8 transition-colors',
															isSelected
																? 'text-primary'
																: 'text-muted-foreground',
														)}
													/>
													<div className='text-center'>
														<p
															className={cn(
																'font-semibold text-sm',
																isSelected ? 'text-primary' : 'text-foreground',
															)}
														>
															{option.label}
														</p>
														<p className='text-xs text-muted-foreground mt-1'>
															{option.description}
														</p>
													</div>
													{isSelected && (
														<div className='absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center'>
															<svg
																className='h-3 w-3 text-primary-foreground'
																fill='none'
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth='2'
																viewBox='0 0 24 24'
																stroke='currentColor'
															>
																<polyline points='20 6 9 17 4 12' />
															</svg>
														</div>
													)}
												</button>
											);
										})}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										type='text'
										placeholder='John Doe'
										disabled={registerMutation.isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type='email'
										placeholder='m@example.com'
										disabled={registerMutation.isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type='password'
										disabled={registerMutation.isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input
										type='password'
										disabled={registerMutation.isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type='submit'
						className='w-full'
						disabled={registerMutation.isPending}
					>
						{registerMutation.isPending
							? 'Creating account...'
							: 'Create account'}
					</Button>
				</div>
				<div className='text-center text-sm'>
					Already have an account?{' '}
					<Link className='underline underline-offset-4' to='/'>
						Sign in
					</Link>
				</div>
			</form>
		</Form>
	);
}
