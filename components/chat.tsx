'use client';

import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/app-context';
import { cn } from '../utils/cn';
import { decryptMessage, encryptMessage } from '../utils/encryption';
import ActiveUsers from './active-users';

const Chat = () => {
	const { messages, socket, user, groupKey, users } = useAppContext();
	const messagesRef = useRef<HTMLDivElement>(null!);
	const previousUsers = useRef(users);

	const handleSubmit = (e: React.FormEvent) => {
		if (!user) return;
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const message = formData.get('message') as string;
		if (!message) return;
		socket.emit('send-message', encryptMessage(message, groupKey), user.username);
		(e.target as HTMLFormElement).reset();
	};

	useEffect(() => {
		if (previousUsers.current.length < users.length) {
			const newUser = users.find(
				(u) => !previousUsers.current.map((u) => u.id).includes(u.id),
			);
			if (newUser) {
				socket.emit(
					'send-message',
					encryptMessage(`${newUser.username} joined the chat`, groupKey),
					'[SERVER]',
				);
			}
		} else if (previousUsers.current.length > users.length) {
			const leftUser = previousUsers.current.find(
				(u) => !users.map((u) => u.id).includes(u.id),
			);
			if (leftUser) {
				socket.emit(
					'send-message',
					encryptMessage(`${leftUser.username} left the chat`, groupKey),
					'[SERVER]',
				);
			}
		}

		previousUsers.current = users;
	}, [users, groupKey, socket]);

	useEffect(() => {
		if (!messagesRef.current) return;
		messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
	}, [messages]);

	return (
		<div className='flex h-full flex-col rounded-xl bg-white p-6'>
			<h2 className='text-lg font-bold'>Chat</h2>
			<ActiveUsers />
			<div
				className='scrollbar-hide mt-4 flex flex-1 flex-col gap-2 overflow-y-auto scroll-smooth'
				ref={messagesRef}>
				{messages.map((message) => (
					<div
						key={message.id}
						className={cn(
							'w-3/4 rounded-xl bg-neutral-100 px-3 py-2',
							message.username === '[SERVER]' &&
								'mx-auto flex w-fit gap-2 bg-transparent text-center text-sm',
							message.username === user?.username &&
								'self-end bg-blue-500 text-white',
						)}>
						<p>{message.username}</p>
						<p className='font-bold'>{decryptMessage(message.content, groupKey)}</p>
					</div>
				))}
			</div>

			<form onSubmit={handleSubmit} className='flex gap-2'>
				<input
					required
					type='text'
					name='message'
					placeholder='Your message'
					className='flex-1 rounded-lg border border-neutral-300 px-3 py-2'
				/>
				<button className='rounded-lg bg-blue-500 px-4 py-2 text-white'>Send</button>
			</form>
		</div>
	);
};

export default Chat;
