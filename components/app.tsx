'use client';

import { DUMMY_SONGS } from '../utils/dummy-data';
import ConnectedUsers from './connected-users';
import Player from './player';
import TrackList from './track-list';
import UploadForm from './upload-form';

const App = () => {
	return (
		<div className='flex h-full'>
			<nav className='flex h-full flex-1 flex-col overflow-y-scroll bg-neutral-100 p-8'>
				<UploadForm />
				<TrackList songs={DUMMY_SONGS} />
			</nav>
			<main className='flex flex-[3] flex-col bg-neutral-200 p-8'>
				<h1 className='text-3xl font-bold'>Spotify Clone</h1>
				<ConnectedUsers />
				<Player />
			</main>
		</div>
	);
};

export default App;
