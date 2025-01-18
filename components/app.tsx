'use client';

import ConnectedUsers from './connected-users';
import Player from './player';
import TrackList from './track-list';
import UploadForm from './upload-form';

const App = () => {
	return (
		<div className='flex'>
			<nav>
				<UploadForm />
				<TrackList />
			</nav>
			<main>
				<h1>App</h1>
				<ConnectedUsers />
				<Player />
			</main>
		</div>
	);
};

export default App;
