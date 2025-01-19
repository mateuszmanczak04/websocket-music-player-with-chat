'use client';

import { useAppContext } from '../context/app-context';

const ConnectedUsers = () => {
	const { users, user } = useAppContext();

	return (
		<div className='mt-4 rounded-xl bg-neutral-100 p-6'>
			<h2 className='text-lg font-bold'>Connected users</h2>

			<ul className='mt-2 flex flex-wrap gap-x-2'>
				{users.map((u) => (
					<li key={u.id} className='rounded-full bg-white px-3 py-1'>
						{u.username}
						{user && u.id === user.id && ' (You)'}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ConnectedUsers;
