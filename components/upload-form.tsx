'use client';

import React from 'react';

const UploadForm = () => {
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const audioFile = formData.get('audioFile');
		const title = formData.get('title');

		if (!audioFile || !title) {
			return;
		}

		console.log('Uploading', title, audioFile);
	};

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-4 bg-neutral-200 p-4'>
			<label htmlFor='audioFile'>Audio file</label>
			<input type='file' name='audioFile' id='audioFile' accept='.mp3' />

			<label htmlFor='title'>Song title</label>
			<input type='text' name='title' id='title' placeholder='Song title' />

			<button type='submit'>Add to library</button>
		</form>
	);
};

export default UploadForm;
