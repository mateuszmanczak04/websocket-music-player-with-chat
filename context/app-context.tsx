'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { API_URL } from '../utils/api';
import { socket } from '../utils/socket';
import { Song, T_PlayerState } from '../utils/types';

type T_User = {
	id: string;
	username: string;
};

type T_Props = {
	users: T_User[];
	user?: T_User;
	playerState: T_PlayerState;
	socket: typeof socket;
	songs: Song[];
	currentSong?: Song;
};

const AppContext = createContext<T_Props | undefined>(undefined);

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
};

interface SocketProviderProps {
	children: ReactNode;
}

export const AppProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const [users, setUsers] = useState<T_User[]>([]);
	const [playerState, setPlayerState] = useState<T_PlayerState>({
		currentSongId: '',
		currentProgress: 0,
		isPlaying: false,
	});
	const [songs, setSongs] = useState<Song[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Load songs from the API on the page load
	useEffect(() => {
		fetch(`${API_URL}/songs`)
			.then((res) => res.json())
			.then((data) => {
				setSongs(data);
			})
			.catch((err) => console.error(err))
			.finally(() => setIsLoading(false));
	}, []);

	useEffect(() => {
		socket.on('users', (users: T_User[]) => {
			setUsers(users);
		});

		socket.on('player-state', (state: T_PlayerState) => {
			setPlayerState(state);
		});

		socket.on('songs', (songs) => {
			setSongs(songs);
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('users');
			socket.off('player-state');
		};
	}, []);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	const currentSong = songs.find((song) => song.id === playerState.currentSongId);
	const user = users.find((user) => user.id === socket.id);

	return (
		<AppContext.Provider
			value={{
				users,
				user,
				playerState,
				socket,
				songs,
				currentSong,
			}}>
			{children}
		</AppContext.Provider>
	);
};
