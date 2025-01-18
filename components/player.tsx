'use client';

import { Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../utils/api';
import { Song } from '../utils/types';

type T_Props = {
	song: Song;
};

const Player = ({ song }: T_Props) => {
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
				<input
					className='flex-1'
					type='range'
					min='0'
					max='100'
					value={progress}
					onChange={handleProgressChange}
				/>
			</div>
			<audio ref={audioRef} src={`${API_URL}/${song.audio}`} />
		</div>
	);
};

export default Player;
