import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
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
			role: 'officeUser',
			password: '',
			confirmPassword: '',
		},
	});

	const handleSubmit = (data: RegisterFormData) => {
		registerMutation.mutate({
			username: data.username,
			email: data.email,
			password: data.password,
			role: 'officeUser',
		});
	};

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
