'use client';

import { useAppContext } from '../context/app-context';

const ActiveUsers = () => {
	const { users, user } = useAppContext();

	return (
		<ul className='mt-2 flex flex-wrap gap-x-2 border-b border-neutral-300 pb-4'>
			{users.map((u) => (
				<li
					key={u.id}
					className='flex items-center rounded-full bg-green-100 px-3 py-1 text-sm'>
					<div className='mr-2 size-3 rounded-full border border-green-400 bg-green-300'></div>
					{u.username}
					{user && u.id === user.id && ' (You)'}
				</li>
			))}
		</ul>
	);
};

export default ActiveUsers;
