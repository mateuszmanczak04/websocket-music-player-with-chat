'use client';

import Image from 'next/image';

type T_Props = {
	songs: Array<{
		id: string;
		title: string;
		artist: string;
		album: string;
		cover: string;
	}>;
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
						<h2>{song.title}</h2>
						<p>
							{song.artist} - {song.album}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default TrackList;
