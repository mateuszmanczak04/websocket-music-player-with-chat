'use client';

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { socket } from '../utils/socket';

type T_Props = {
	isConnected: boolean;
	users: string[];
	handleEmitPlay: (songId: string, progress: number) => void;
	setPlayCallback: (callback: (songId: string, progress: number) => void) => void;
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
	const playCallback = useRef<(songId: string, progress: number) => void>(() => {});

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

		socket.on('play', (songId: string, progress: number) => {
			if (playCallback) {
				playCallback.current(songId, progress);
			}
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('users');
		};
	}, [playCallback]);

	const handleEmitPlay = (songId: string, progress: number) => {
		socket.emit('play', songId, progress);
	};

	const setPlayCallback = (callback: (songId: string, progress: number) => void) => {
		playCallback.current = callback;
	};

	return (
		<SocketContext.Provider value={{ isConnected, users, handleEmitPlay, setPlayCallback }}>
			{children}
		</SocketContext.Provider>
	);
};
