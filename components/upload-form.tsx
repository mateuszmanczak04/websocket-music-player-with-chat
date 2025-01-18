'use client';

import React, { useState } from 'react';
import { API_URL } from '../utils/api';

const UploadForm = () => {
	const [audio, setAudio] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [cover, setCover] = useState<string>('');

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (!audio || !title) {
			return;
		}

		fetch(`${API_URL}/songs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ audio, title, cover }),
		})
			.then((response) => {
				if (response.ok) {
					alert('Song added to library');
				} else {
					alert('Failed to add song to library');
				}
			})
			.catch((error) => {
				console.error('Failed to add song to library', error);
			});
	};

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-4 bg-neutral-200 p-4'>
			{/* <label htmlFor='audioFile'>Audio file</label>
			<input type='file' name='audioFile' id='audioFile' accept='.mp3' /> */}

			<label htmlFor='audio'>Audio URL</label>
			<input
				type='text'
				name='audio'
				id='audio'
				placeholder='Song audio url'
				required
				value={audio}
				onChange={(e) => setAudio(e.target.value)}
			/>

			<label htmlFor='cover'>Cover URL</label>
			<input
				type='text'
				name='cover'
				id='cover'
				placeholder='Song cover url'
				required
				value={cover}
				onChange={(e) => setCover(e.target.value)}
			/>

			<label htmlFor='title'>Song title</label>
			<input
				type='text'
				name='title'
				id='title'
				placeholder='Song title'
				required
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>

			<button type='submit'>Add to library</button>
		</form>
	);
};

export default UploadForm;
