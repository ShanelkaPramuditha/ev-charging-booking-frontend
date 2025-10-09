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
import { useLoginMutation } from '@/queries/auth.queries';
import { type LoginFormData, loginSchema } from '@/schemas/auth.schema';

export function LoginForm({
	className,
	...props
}: React.ComponentProps<'form'>) {
	const loginMutation = useLoginMutation();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const handleSubmit = (data: LoginFormData) => {
		loginMutation.mutate(data);
	};

	return (
		<Form {...form}>
			<form
				className={cn('flex flex-col gap-6', className)}
				onSubmit={form.handleSubmit(handleSubmit)}
				{...props}
			>
				<div className='flex flex-col items-center gap-2 text-center'>
					<h1 className='text-2xl font-bold'>Login to your account</h1>
					<p className='text-muted-foreground text-sm text-balance'>
						Enter your email below to login to your account
					</p>
				</div>
				<div className='grid gap-6'>
					{loginMutation.isError && (
						<div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3'>
							{loginMutation.error?.message || 'Login failed'}
						</div>
					)}

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
										disabled={loginMutation.isPending}
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
								<div className='flex items-center'>
									<FormLabel>Password</FormLabel>
								</div>
								<FormControl>
									<Input
										type='password'
										disabled={loginMutation.isPending}
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
						disabled={loginMutation.isPending}
					>
						{loginMutation.isPending ? 'Signing in...' : 'Login'}
					</Button>

					<div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
						<span className='bg-background text-muted-foreground relative z-10 px-2'>
							Or
						</span>
					</div>
				</div>
				<div className='text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link className='underline underline-offset-4' to='/register'>
						Sign up
					</Link>
				</div>
			</form>
		</Form>
	);
}
