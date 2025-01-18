'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '../utils/api';
import { Song } from '../utils/types';
import ConnectedUsers from './connected-users';
import Player from './player';
import TrackList from './track-list';
import UploadForm from './upload-form';

const App = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentSongId, setCurrentSongId] = useState('');

	useEffect(() => {
		fetch(`${API_URL}/songs`)
			.then((res) => res.json())
			.then((data) => {
				setSongs(data);
				setCurrentSongId(data[0]?.id);
			})
			.catch((err) => console.error(err))
			.finally(() => setIsLoading(false));
	}, []);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	const currentSong = songs.find((song) => song.id === currentSongId);

	return (
		<div className='flex h-full'>
			<nav className='flex h-full flex-1 flex-col overflow-y-scroll bg-blue-100 p-8'>
				<UploadForm />
				<TrackList songs={songs} />
			</nav>
			<main className='flex flex-[3] flex-col bg-white p-8'>
				<h1 className='text-3xl font-bold'>Spotify Clone</h1>
				<ConnectedUsers />
				{currentSong ? <Player song={currentSong} /> : <p>No song selected</p>}
			</main>
		</div>
	);
};

export default App;
