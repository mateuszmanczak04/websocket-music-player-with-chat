'use client';

import { Pause, Play, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../utils/api';
import { Song } from '../utils/types';

type T_Props = {
	song: Song;
	deleteSong: (id: string) => void;
};

const Player = ({ song, deleteSong }: T_Props) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const audioRef = useRef<HTMLAudioElement>(null!);

	const togglePlay = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	// Update the progress bar when the song is playing
	const handleTimeUpdate = () => {
		if (audioRef.current) {
			const currentTime = audioRef.current.currentTime;
			const duration = audioRef.current.duration;
			setProgress((currentTime / duration) * 100);
		}
	};

	// Update the song progress when the user changes the progress bar
	const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (audioRef.current) {
			const newProgress = Number(event.target.value);
			audioRef.current.currentTime = (audioRef.current.duration * newProgress) / 100;
			setProgress(newProgress);
		}
	};

	const handleDelete = async () => {
		const response = await fetch(`${API_URL}/songs/${song.id}`, {
			method: 'DELETE',
		});
		if (response.ok) {
			deleteSong(song.id);
		}
	};

	// Update the progress bar when the song is playing
	useEffect(() => {
		const audioElement = audioRef.current;
		if (audioElement) {
			audioElement.addEventListener('timeupdate', handleTimeUpdate);
		}
		return () => {
			if (audioElement) {
				audioElement.removeEventListener('timeupdate', handleTimeUpdate);
			}
		};
	}, []);

	// Reset the player when the song changes
	useEffect(() => {
		setIsPlaying(false);
		setProgress(0);
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
	}, [song]);

	return (
		<article className='group mt-4 flex max-w-md flex-col rounded-xl bg-neutral-100 p-6'>
			<div className='relative'>
				<Image
					src={`${API_URL}/${song.cover}`}
					alt={song.title}
					width={200}
					height={200}
					className='w-full rounded-xl'
				/>
				<h2 className='absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-b from-transparent via-black/30 to-black/40 p-2 pt-8 text-center text-xl font-semibold text-white'>
					{song.title}
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
						onClick={handleDelete}>
						<Trash />
					</button>
				</div>

				<input
					className='mt-4 w-full'
					type='range'
					min='0'
					max='100'
					value={progress.toString()}
					onChange={handleProgressChange}
				/>
			</div>
			<audio ref={audioRef} src={`${API_URL}/${song.audio}`} />
		</article>
	);
};

export default Player;
