'use client';

import Chat from './chat';
import Player from './player';
import TrackList from './track-list';
import UploadForm from './upload-form';

const App = () => {
	return (
		<div className='flex h-full'>
			<nav className='flex h-full shrink-0 grow-0 basis-96 flex-col bg-neutral-100 p-8'>
				<UploadForm />
				<TrackList />
			</nav>
			<main className='grow-1 shrink-1 flex basis-full flex-col bg-white p-8'>
				<h1 className='text-3xl font-bold'>Spotify Clone</h1>
				<Player />
			</main>
			<aside className='shrink-0 grow-0 basis-96 bg-neutral-100 p-8'>
				<Chat />
			</aside>
		</div>
	);
};

export default App;
