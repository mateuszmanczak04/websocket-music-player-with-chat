'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '../context/app-context';
import { cn } from '../utils/cn';

const ActiveUsers = () => {
	const { users, user } = useAppContext();
	const [, setToggler] = useState(false);

	// Toggles the component every second to update the UI
	useEffect(() => {
		const interval = setInterval(() => {
			setToggler((prev) => !prev);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<ul className='mt-2 flex flex-wrap gap-x-2 border-b border-neutral-300 pb-4'>
			{users.map((u) => (
				<li
					key={u.id}
					className={cn(
						'flex items-center rounded-full bg-green-100 px-3 py-1 text-sm',
						// Show a yellow indicator if the user is inactive for more than 30 seconds
						user?.lastActive &&
							new Date().getTime() - new Date(u.lastActive).getTime() > 5000 &&
							'bg-yellow-100',
					)}>
					<div
						className={cn(
							'mr-2 size-3 rounded-full border border-green-400 bg-green-300',
							// Show a yellow indicator if the user is inactive for more than 30 seconds
							user?.lastActive &&
								new Date().getTime() - new Date(u.lastActive).getTime() > 5000 &&
								'border-yellow-400 bg-yellow-300',
						)}></div>
					{u.username}
					{user && u.id === user.id && ' (You)'}
				</li>
			))}
		</ul>
	);
};

export default ActiveUsers;
