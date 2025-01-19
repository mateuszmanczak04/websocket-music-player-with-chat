'use client';

import Chat from './chat';
import Player from './player';
import TrackList from './track-list';
import UploadForm from './upload-form';

const App = () => {
	return (
		<div className='flex h-full'>
			<nav className='flex h-full shrink-0 grow-0 basis-[480px] flex-col bg-neutral-100 p-6'>
				<UploadForm />
				<TrackList />
			</nav>
			<Player />
			<aside className='shrink-0 grow-0 basis-[600px] bg-neutral-100 p-6'>
				<Chat />
			</aside>
		</div>
	);
};

export default App;
