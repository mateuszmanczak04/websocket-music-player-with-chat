'use client';

import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/app-context';
import { decryptMessage, encryptMessage } from '../utils/encryption';
import ConnectedUsers from './connected-users';

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
			<ConnectedUsers />
			<div
				className='mt-4 flex flex-1 flex-col gap-2 overflow-y-auto scroll-smooth'
				ref={messagesRef}>
				{messages.map((message) => (
					<div
						key={message.id}
						className='w-3/4 rounded-xl px-3 py-2'
						style={{
							alignSelf:
								message.username === user?.username ? 'flex-end' : 'flex-start',
							backgroundColor: (() => {
								switch (message.username) {
									case '[SERVER]':
										return 'transparent';
									case user?.username:
										return '#3b82f6';
									default:
										return '#f5f5f5';
								}
							})(),
							color: message.username === user?.username ? 'white' : '#262626',
							width: message.username === '[SERVER]' ? '100%' : 'fit-content',
							fontSize: message.username === '[SERVER]' ? '0.8rem' : '1rem',
							textAlign: message.username === '[SERVER]' ? 'center' : 'left',
							display: message.username === '[SERVER]' ? 'flex' : 'block',
							gap: message.username === '[SERVER]' ? '0.5rem' : '0',
						}}>
						<p>{message.username}</p>
						<p className='font-bold'>{decryptMessage(message.content, groupKey)}</p>
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
