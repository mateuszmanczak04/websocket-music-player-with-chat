'use client';

import { useEffect, useState } from 'react';
import { socket } from '../utils/socket';

export const useSocketConnection = () => {
	const [users, setUsers] = useState<string[]>([]);

	useEffect(() => {
		// connect the socket if not already connected
		if (!socket.connected) {
			socket.connect();
		}

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		socket.on('users', (users: string[]) => {
			console.log(users);
			setUsers(users);
		});

		return () => {
			socket.off('users');
		};
	}, []);

	return { users };
};
