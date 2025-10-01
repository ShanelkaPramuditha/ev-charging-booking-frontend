import type { IUser } from '@/types/user';

export function Profile({ user }: { user: IUser }) {
	return (
		<div>
			<h1 className='text-2xl font-bold mb-4'>Profile</h1>
			<div className='space-y-2'>
				<p>
					<strong>Name:</strong> {user?.name}
				</p>
				<p>
					<strong>Email:</strong> {user?.email}
				</p>
				<p>
					<strong>User ID:</strong> {user?.id}
				</p>
			</div>
		</div>
	);
}
