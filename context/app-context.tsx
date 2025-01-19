'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { API_URL } from '../utils/api';
import { socket } from '../utils/socket';
import { T_Message, T_PlayerState, T_Song, T_User } from '../utils/types';

type T_ContextProps = {
	users: T_User[];
	user?: T_User;
	playerState: T_PlayerState;
	socket: typeof socket;
	songs: T_Song[];
	messages: T_Message[];
	currentSong?: T_Song;
};

const AppContext = createContext<T_ContextProps | undefined>(undefined);

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
};

type T_ProviderProps = {
	children: ReactNode;
};

export const AppProvider = ({ children }: T_ProviderProps) => {
	const [users, setUsers] = useState<T_User[]>([]);
	const [messages, setMessages] = useState<T_Message[]>([]);
	const [playerState, setPlayerState] = useState<T_PlayerState>({
		currentSongId: '',
		currentProgress: 0,
		isPlaying: false,
	});
	const [songs, setSongs] = useState<T_Song[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Load songs and messages from the API on the page load
	useEffect(() => {
		fetch(`${API_URL}/songs`)
			.then((res) => res.json())
			.then((data) => {
				setSongs(data);
			})
			.then(() => fetch(`${API_URL}/messages`))
			.then((res) => res.json())
			.then((data) => {
				setMessages(data);
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

		socket.on('message', (message) => {
			setMessages((prev) => [...prev, message]);
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('users');
			socket.off('player-state');
			socket.off('songs');
			socket.off('messages');
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
				messages,
				currentSong,
			}}>
			{children}
		</AppContext.Provider>
	);
};
