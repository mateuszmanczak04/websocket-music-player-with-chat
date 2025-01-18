'use client';

import { useSocketConnection } from '../hooks/useSocketConnection';

const ConnectedUsers = () => {
	const { users, isConnected } = useSocketConnection();

	return (
		<div className='bg-neutral-200 p-4'>
			<h2 className='text-lg font-bold'>Connected users</h2>
			<p>{isConnected ? 'Connected' : 'Disconnected'}</p>
			<ul className='flex gap-x-2'>
				{users.map((user) => (
					<li key={user} className='rounded-full bg-white px-3 py-1'>
						{user}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ConnectedUsers;
