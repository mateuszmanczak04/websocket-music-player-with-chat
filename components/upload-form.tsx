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
		<form onSubmit={handleSubmit} className='flex flex-col rounded-xl bg-white p-6'>
			<h2 className='mx-2 text-xl font-bold'>Add new song to library</h2>

			<label htmlFor='title' className='mx-2 mt-2 font-semibold'>
				Title
			</label>
			<input
				type='text'
				name='title'
				id='title'
				placeholder='Song title'
				className='rounded-xl border border-neutral-300 px-3 py-2'
				required
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>

			<label
				htmlFor='audio'
				className='mt-4 w-full cursor-pointer rounded-xl bg-neutral-100 px-3 py-2 font-medium hover:bg-neutral-200'>
				Audio file{' '}
				<input type='file' required name='audio' id='audio' accept='.mp3' className='' />
			</label>

			<label
				htmlFor='cover'
				className='mt-4 w-full cursor-pointer rounded-xl bg-neutral-100 px-3 py-2 font-medium hover:bg-neutral-200'>
				Cover image{' '}
				<input
					type='file'
					required
					name='cover'
					id='cover'
					accept='.jpg,.png'
					className=''
				/>
			</label>

			<button
				type='submit'
				className='mt-4 rounded-xl bg-blue-500 px-3 py-2 text-white hover:bg-blue-400'>
				Add to library
			</button>
		</form>
	);
};

export default UploadForm;
