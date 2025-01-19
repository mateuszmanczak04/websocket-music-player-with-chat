'use client';

import { Pause, Play, Trash } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/app-context';
import { API_URL } from '../utils/api';

const Player = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null!);
	const { playerState, socket, currentSong, songs } = useAppContext();
	const [localProgress, setLocalProgress] = useState(playerState.currentProgress);

	const handleDeleteSong = async () => {
		if (!currentSong) return;
		const response = await fetch(`${API_URL}/songs/${currentSong.id}`, {
			method: 'DELETE',
		});
		if (response.ok) {
			socket.emit(
				'set-songs',
				songs.filter((song) => song.id !== currentSong.id),
			);
		}
	};

	// When user clicks on play/pause button
	const togglePlay = useCallback(() => {
		if (!currentSong) return;

		socket.emit('set-player-state', {
			isPlaying: !isPlaying,
		});
	}, [socket, currentSong, isPlaying]);

	// When user clicks on progress bar
	const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		socket.emit('set-player-state', {
			currentProgress: Number(event.target.value),
		});
	};

	// Listen for updates from the server
	useEffect(() => {
		if (!navigator.userActivation.hasBeenActive) return;

		setIsPlaying(playerState.isPlaying);
		setLocalProgress(playerState.currentProgress);

		audioRef.current.currentTime = playerState.currentProgress;
		if (playerState.isPlaying) {
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}
	}, [playerState]);

	if (!currentSong) return <p className='mt-4'>No song selected</p>;

	return (
		<article className='group mt-4 flex max-w-md flex-col rounded-xl bg-neutral-100 p-6'>
			<div className='relative'>
				<Image
					src={`${API_URL}/${currentSong.cover}`}
					alt={currentSong.title}
					width={200}
					height={200}
					className='w-full rounded-xl'
				/>
				<h2 className='absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-b from-transparent via-black/30 to-black/40 p-2 pt-8 text-center text-xl font-semibold text-white'>
					{currentSong.title}
				</h2>
			</div>
			<div className='mt-4 rounded-xl bg-white p-6'>
				<div className='flex justify-center gap-2'>
					<button
						className='grid size-12 cursor-pointer place-content-center rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
						onClick={togglePlay}>
						{isPlaying ? <Pause /> : <Play />}
					</button>
					<button
						className='grid size-12 cursor-pointer place-content-center rounded-full bg-red-100 text-red-800 hover:bg-red-200'
						onClick={handleDeleteSong}>
						<Trash />
					</button>
				</div>

				<input
					className='mt-4 w-full'
					type='range'
					min='0'
					max={audioRef.current?.duration || 0}
					value={localProgress}
					onChange={handleProgressChange}
				/>
			</div>
			<audio
				ref={audioRef}
				src={`${API_URL}/audio/${currentSong.id}`}
				onTimeUpdate={() => setLocalProgress(audioRef.current.currentTime)}
			/>
		</article>
	);
};

export default Player;
