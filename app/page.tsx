import { Metadata } from 'next';
import App from '../components/app';

export const metadata: Metadata = {
	title: 'Spotify Clone',
	description: 'A Spotify clone built with Next.js',
};

export default function Home() {
	return <App />;
}
