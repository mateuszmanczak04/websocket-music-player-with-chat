'use client';

import { useEffect, useState } from 'react';
import { socket } from '../utils/socket';

export const useSocketConnection = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [users, setUsers] = useState<string[]>([]);

	useEffect(() => {
		const onConnect = () => {
			console.log('CONNECTED');
			setIsConnected(true);
		};

		const onDisconnect = () => {
			console.log('DISCONNECTED');
			setIsConnected(false);
		};

		if (socket.connected) {
			onConnect();
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
		};
	}, []);

	useEffect(() => {
		socket.on('users', (users: string[]) => {
			console.log('USERS', users);
			setUsers(users);
		});

		return () => {
			socket.off('users');
		};
	}, []);

	return { users, isConnected };
};
