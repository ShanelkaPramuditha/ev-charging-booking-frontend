import Notification from './notification';

export function Header() {
	return (
		<header className='bg-background sticky top-0 flex shrink-0 flex-col border-b'>
			<div className='flex items-center gap-2 p-2'>
				<div className='flex justify-end flex-1 items-center gap-2'>
					<Notification />
				</div>
			</div>
		</header>
	);
}
