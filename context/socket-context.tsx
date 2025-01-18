'use client';

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { socket } from '../utils/socket';

type T_Props = {
	isConnected: boolean;
	users: string[];
	handleEmitPlay: (songId: string) => void;
	setPlayCallback: (callback: (songId: string) => void) => void;
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
	const playCallback = useRef<(songId: string) => void>(() => {});

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

		socket.on('play', (songId: string) => {
			if (playCallback) {
				playCallback.current(songId);
			}
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('users');
		};
	}, [playCallback]);

	const handleEmitPlay = (songId: string) => {
		socket.emit('play', songId);
	};

	const setPlayCallback = (callback: (songId: string) => void) => {
		playCallback.current = callback;
	};

	return (
		<SocketContext.Provider value={{ isConnected, users, handleEmitPlay, setPlayCallback }}>
			{children}
		</SocketContext.Provider>
	);
};
