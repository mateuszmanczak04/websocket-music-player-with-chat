'use client';

import Image from 'next/image';
import { useState } from 'react';
import { DUMMY_SONGS } from '../utils/dummy-data';

const Player = () => {
	const [currentSong] = useState(DUMMY_SONGS[0]);

	return (
		<div className='bg-neutral-200 p-4'>
			<h2 className='text-lg font-bold'>Player</h2>
			<div className='flex flex-col gap-4'>
				<Image src={currentSong.cover} alt={currentSong.title} width={200} height={200} />
				<div className='flex flex-col gap-4'>
					<button>Play/Pause</button>
					<input type='range' min='0' max='100' />
				</div>
			</div>
		</div>
	);
};

export default Player;
