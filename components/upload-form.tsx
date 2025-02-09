'use client';

import React, { useState } from 'react';
import { useAppContext } from '../context/app-context';
import { API_URL } from '../utils/api';

const UploadForm = () => {
	const [title, setTitle] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const { songs, socket } = useAppContext();

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		setIsLoading(true);
		fetch(`${API_URL}/songs`, {
			method: 'POST',
			headers: {
				enctype: 'multipart/form-data',
			},
			body: formData,
		})
			.then((res) => res.json())
			.then((response) => {
				setTitle('');
				setMessage('Song added to library');
				(event.target as HTMLFormElement).reset();
				socket.emit('set-songs', [response, ...songs]);
			})
			.catch(() => {
				setError('Failed to add song');
			})
			.finally(() => setIsLoading(false));
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
				className='mt-4 w-full cursor-pointer overflow-clip rounded-xl bg-neutral-100 px-3 py-2 font-medium hover:bg-neutral-200'>
				Audio file{' '}
				<input type='file' required name='audio' id='audio' accept='.mp3' className='' />
			</label>

			<label
				htmlFor='cover'
				className='mt-4 w-full cursor-pointer overflow-clip rounded-xl bg-neutral-100 px-3 py-2 font-medium hover:bg-neutral-200'>
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

			{isLoading && <p className='mt-4 text-center'>Loading...</p>}
			{message && <p className='mt-4 text-center text-green-500'>{message}</p>}
			{error && <p className='mt-4 text-center text-red-500'>{error}</p>}
		</form>
	);
};

export default UploadForm;
