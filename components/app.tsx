'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '../utils/api';
import { Song } from '../utils/types';
import Player from './player';
import TrackList from './track-list';
import UploadForm from './upload-form';

const App = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentSongId, setCurrentSongId] = useState('');

	const playSong = (id: string) => {
		setCurrentSongId(id);
	};

	const addSong = (song: Song) => {
		setSongs((prev) => [song, ...prev]);
	};

	const deleteSong = async (id: string) => {
		setSongs((prev) => prev.filter((song) => song.id !== id));
	};

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
			<nav className='flex h-full shrink-0 grow-0 basis-96 flex-col bg-neutral-100 p-8'>
				<UploadForm addSong={addSong} />
				<TrackList playSong={playSong} songs={songs} />
			</nav>
			<main className='grow-1 shrink-1 flex basis-full flex-col bg-white p-8'>
				<h1 className='text-3xl font-bold'>Spotify Clone</h1>
				{/* <ConnectedUsers /> */}
				{currentSong ? (
					<Player deleteSong={deleteSong} song={currentSong} />
				) : (
					<p>No song selected</p>
				)}
			</main>
		</div>
	);
};

export default App;
