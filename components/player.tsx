'use client';

import { Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { API_URL } from '../utils/api';
import { Song } from '../utils/types';

type T_Props = {
	song: Song;
};

const Player = ({ song }: T_Props) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const togglePlay = () => {
		setIsPlaying((prev) => !prev);
	};

	return (
		<div className='group flex max-w-md flex-col rounded-xl bg-white p-4'>
			<Image
				src={`${API_URL}/${song.cover}`}
				alt={song.title}
				width={200}
				height={200}
				className='w-full rounded-xl'
			/>
			<h2 className='mx-2 mt-4 text-xl font-bold'>{song.title}</h2>
			<div className='mt-4 flex gap-4 rounded-xl bg-neutral-100 p-4'>
				<button
					className='grid size-12 cursor-pointer place-content-center rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
					onClick={togglePlay}>
					{isPlaying ? <Pause /> : <Play />}
				</button>
				<input className='flex-1' type='range' min='0' max='100' />
			</div>
		</div>
	);
};

export default Player;
