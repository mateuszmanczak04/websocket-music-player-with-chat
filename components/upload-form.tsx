'use client';

import React, { useState } from 'react';
import { API_URL } from '../utils/api';

const UploadForm = () => {
	const [title, setTitle] = useState<string>('xxx');

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		fetch(`${API_URL}/songs`, {
			method: 'POST',
			headers: {
				enctype: 'multipart/form-data',
			},
			body: formData,
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
			<label htmlFor='audio'>Audio file</label>
			<input type='file' name='audio' id='audio' accept='.mp3' />

			<label htmlFor='cover'>Cover image</label>
			<input type='file' name='cover' id='cover' accept='.jpg,.png' />

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
