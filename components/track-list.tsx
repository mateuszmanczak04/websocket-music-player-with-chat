'use client';

import Image from 'next/image';
import { Song } from '../utils/types';

type T_Props = {
	songs: Song[];
};

const TrackList = ({ songs }: T_Props) => {
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
