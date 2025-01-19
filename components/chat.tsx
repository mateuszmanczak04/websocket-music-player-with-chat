'use client';

import { useAppContext } from '../context/app-context';

const Chat = () => {
	const { messages, socket, user } = useAppContext();

	const handleSubmit = (e: React.FormEvent) => {
		if (!user) return;
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const message = formData.get('message') as string;
		if (!message) return;
		socket.emit('send-message', message, user.username);
		(e.target as HTMLFormElement).reset();
	};

	return (
		<div className='flex h-full flex-col rounded-xl bg-white p-6'>
			<h2 className='text-lg font-bold'>Chat</h2>
			<div className='mt-4 flex flex-1 flex-col gap-2 overflow-y-auto'>
				{messages.map((message) => (
					<div
						key={message.id}
						className='w-3/4 rounded-xl px-3 py-2'
						style={{
							alignSelf:
								message.username === user?.username ? 'flex-end' : 'flex-start',
							backgroundColor:
								message.username === user?.username ? '#3b82f6' : '#f5f5f5',
							color: message.username === user?.username ? 'white' : '#262626',
						}}>
						<p>{message.username}</p>
						<p className='font-bold'>{message.content}</p>
					</div>
				))}
			</div>

			<form
				onSubmit={handleSubmit}
				className='mt-4 flex gap-2 rounded-xl border border-neutral-300 p-2'>
				<input
					required
					type='text'
					name='message'
					placeholder='Your message'
					className='rounded-lg border border-neutral-300 px-3 py-2'
				/>
				<button className='rounded-lg bg-blue-500 px-4 py-2 text-white'>Send</button>
			</form>
		</div>
	);
};

export default Chat;
