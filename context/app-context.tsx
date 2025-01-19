'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { API_URL } from '../utils/api';
import { socket } from '../utils/socket';
import { Song, T_PlayerState } from '../utils/types';

type T_Props = {
	isConnected: boolean;
	users: string[];
	playerState: T_PlayerState;
	socket: typeof socket;
	addSong: (song: Song) => void;
	deleteSong: (id: string) => void;
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
	const [isConnected, setIsConnected] = useState(false);
	const [users, setUsers] = useState<string[]>([]);
	const [playerState, setPlayerState] = useState<T_PlayerState>({
		currentSongId: '',
		currentProgress: 0,
		isPlaying: false,
	});
	const [songs, setSongs] = useState<Song[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const addSong = (song: Song) => {
		setSongs((prev) => [song, ...prev]);
	};

	const deleteSong = async (id: string) => {
		setSongs((prev) => prev.filter((song) => song.id !== id));
	};

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

		socket.on('songs', (songs) => {
			console.log(songs);
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

	return (
		<AppContext.Provider
			value={{
				isConnected,
				users,
				playerState,
				socket,
				addSong,
				deleteSong,
				songs,
				currentSong,
			}}>
			{children}
		</AppContext.Provider>
	);
};
