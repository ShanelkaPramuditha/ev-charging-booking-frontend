import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth/use-auth';

export function UserDashboard() {
	const { user } = useAuth();

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Dashboard</h1>
				<p className='text-muted-foreground'>
					Welcome back, {user?.username || 'User'}!
				</p>
			</div>

			<div className='grid gap-6 md:grid-cols-2'>
				{/* User Information Card */}
				<Card>
					<CardHeader>
						<CardTitle>User Information</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<div className='text-sm font-medium'>Name</div>
							<p className='text-sm text-muted-foreground'>
								{user?.username || 'Not provided'}
							</p>
						</div>
						<div>
							<div className='text-sm font-medium'>Email</div>
							<p className='text-sm text-muted-foreground'>{user?.email}</p>
						</div>
						<div>
							<div className='text-sm font-medium'>User ID</div>
							<p className='text-sm text-muted-foreground font-mono'>
								{user?.id}
							</p>
						</div>
						<div>
							<div className='text-sm font-medium'>Member Since</div>
							<p className='text-sm text-muted-foreground'>
								{user?.createdAt
									? new Date(user.createdAt).toLocaleDateString()
									: 'Unknown'}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-muted-foreground'>
						More features coming soon! This is where you&apos;ll be able to
						manage your account, view your activity, and access various tools.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
