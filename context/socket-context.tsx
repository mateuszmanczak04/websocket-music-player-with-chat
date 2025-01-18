'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { socket } from '../utils/socket';

type T_Props = {
	isConnected: boolean;
	users: string[];
};

const SocketContext = createContext<T_Props | undefined>(undefined);

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
};

interface SocketProviderProps {
	children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const [isConnected, setIsConnected] = useState(false);
	const [users, setUsers] = useState<string[]>([]);

	useEffect(() => {
		socket.on('connect', () => {
			setIsConnected(true);
		});
		socket.on('disconnect', () => {
			setIsConnected(false);
		});

		socket.on('users', (users: string[]) => {
			setUsers(users);
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('users');
		};
	}, []);

	return (
		<SocketContext.Provider value={{ isConnected, users }}>{children}</SocketContext.Provider>
	);
};
