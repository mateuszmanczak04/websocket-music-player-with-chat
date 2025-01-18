'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { API_URL } from '../utils/api';
import { Song } from '../utils/types';

const TrackList = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		console.log(`${API_URL}/songs`);
		fetch(`${API_URL}/songs`)
			.then((res) => res.json())
			.then((data) => setSongs(data))
			.catch((err) => console.error(err))
			.finally(() => setIsLoading(false));
	}, []);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<div className='mt-4 flex flex-col gap-4 bg-neutral-200 p-4'>
			{songs.map((song) => (
				<div key={song.id} className='flex gap-4'>
					<Image
						src={song.cover}
						alt={song.title}
						width={48}
						height={48}
						className='h-16 w-16'
					/>
					<div>
						<h2>Title: {song.title}</h2>
						<p>Audio url:{song.audio} </p>
					</div>
				</div>
			))}
		</div>
	);
};

export default TrackList;
