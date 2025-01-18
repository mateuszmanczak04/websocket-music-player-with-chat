'use client';

const ConnectedUsers = () => {
	return (
		<div className='bg-neutral-200 p-4'>
			<h2 className='text-lg font-bold'>Connected users</h2>
			<ul className='flex gap-x-2'>
				<li className='rounded-full bg-white px-3 py-1'>John Doe</li>
				<li className='rounded-full bg-white px-3 py-1'>Jane Doe</li>
			</ul>
		</div>
	);
};

export default ConnectedUsers;
