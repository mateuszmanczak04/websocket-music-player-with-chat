'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { T_PlayerState } from '../utils/types';

type T_Props = {
	isConnected: boolean;
	users: string[];
	playerState: T_PlayerState;
	socket: typeof socket;
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
	const [playerState, setPlayerState] = useState<T_PlayerState>({
		currentSongId: '',
		currentProgress: 0,
		isPlaying: false,
	});

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

		socket.on('player-state', (state: T_PlayerState) => {
			setPlayerState(state);
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('users');
			socket.off('player-state');
		};
	}, []);

	return (
		<SocketContext.Provider value={{ isConnected, users, playerState, socket }}>
			{children}
		</SocketContext.Provider>
	);
};
