import { Metadata } from 'next';
import App from '../components/app';
import { SocketProvider } from '../context/socket-context';

export const metadata: Metadata = {
	title: 'Spotify Clone',
	description: 'A Spotify clone built with Next.js',
};

export default function Home() {
	return (
		<SocketProvider>
			<App />
		</SocketProvider>
	);
}
