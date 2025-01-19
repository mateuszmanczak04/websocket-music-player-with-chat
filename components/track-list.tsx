'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useAppContext } from '../context/app-context';
import { API_URL } from '../utils/api';

const TrackList = () => {
	const { socket, songs } = useAppContext();

	const handleChooseSong = (songId: string) => {
		socket.emit('set-player-state', {
			currentSongId: songId,
		});
	};

	return (
		<div className='mt-4 flex flex-1 flex-col gap-4 overflow-y-scroll rounded-xl bg-white p-6'>
			<h2 className='mx-2 text-xl font-bold'>Songs</h2>
			{songs.length === 0 && <p>No songs available</p>}
			{songs.map((song) => (
				<article
					key={song.id}
					className='group flex cursor-pointer items-center gap-4 rounded-t-xl border-b border-gray-200 p-4 pb-4 hover:bg-neutral-100'
					onClick={() => handleChooseSong(song.id)}>
					<Image
						src={`${API_URL}/${song.cover}`}
						alt={song.title}
						width={48}
						height={48}
						className='h-16 w-16 rounded-xl object-cover'
					/>
					<div>
						<h2 className='text-lg font-bold group-hover:underline'>{song.title}</h2>
						<button className='grid size-8 cursor-pointer place-content-center rounded-full bg-neutral-100 text-neutral-800 group-hover:bg-neutral-200'>
							<Play className='size-4' />
						</button>
					</div>
				</article>
			))}
		</div>
	);
};

export default TrackList;
