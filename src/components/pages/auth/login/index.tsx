import LoginImage from '../../../../../assets/login-image.jpg';
import { LoginForm } from './login-form';

export function Login() {
	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
			{/* Right */}
			<div className='flex flex-col gap-4 p-6 md:p-10'>
				<div className='flex flex-1 items-center justify-center'>
					<div className='w-full max-w-xs'>
						<LoginForm />
					</div>
				</div>
			</div>
			{/* Left */}
			<div className='bg-muted relative hidden lg:block'>
				<img
					src={LoginImage}
					alt='Login'
					className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
				/>
			</div>
		</div>
	);
}
