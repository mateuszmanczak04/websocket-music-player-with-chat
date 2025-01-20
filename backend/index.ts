import type { Song } from '@prisma/client';
import cors from 'cors';
import crypto from 'crypto';
import type { Request, Response } from 'express';
import express from 'express';
import http from 'http';
import multer from 'multer';
import { Server } from 'socket.io';
import { names, uniqueNamesGenerator } from 'unique-names-generator';
import { getMessages } from './controllers/messageController';
import {
	createSong,
	deleteSong,
	getAllSongs,
	getSongById,
	updateSong,
} from './controllers/songController';
import { streamAudio } from './controllers/streamingController';
import db from './prisma/database';
import { getLocalNetworkIP } from './utils/ip';

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
	destination: './uploads/',
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

app.get('/songs', getAllSongs);
app.get('/songs/:id', getSongById);
app.post(
	'/songs',
	upload.fields([
		{ name: 'audio', maxCount: 1 },
		{ name: 'cover', maxCount: 1 },
	]),
	createSong,
);
app.put('/songs/:id', updateSong);
app.delete('/songs/:id', deleteSong);
app.get('/audio/:id', streamAudio);
app.get('/messages', getMessages);

app.get('/', (req: Request, res: Response) => {
	res.send('Hello, world!');
});

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

type T_User = {
	id: string;
	username: string;
	lastActive: Date;
};

const connectedUsers = new Array<T_User>();
const playerState = {
	currentSongId: '',
	currentProgress: 0,
	isPlaying: false,
};
const groupKey = crypto.randomBytes(32).toString('hex');

// Needed to fix a bug with the 'node-XMLHttpRequest' user-agent
io.use((socket, next) => {
	const userAgent = socket.handshake.headers['user-agent'];

	// Block connections with 'node-XMLHttpRequest' user-agent
	if (userAgent === 'node-XMLHttpRequest') {
		return next(new Error('Unauthorized connection'));
	}

	next(); // Allow other connections
});

const triggerUserActivity = (userId: string) => {
	const user = connectedUsers.find((user) => user.id === userId);
	if (user) {
		user.lastActive = new Date();
	}
	io.emit('users', connectedUsers);
};

io.on('connection', (socket) => {
	const userId = socket.id;
	connectedUsers.push({
		id: userId,
		lastActive: new Date(),
		username: uniqueNamesGenerator({ dictionaries: [names] }),
	});

	io.emit('users', connectedUsers);
	socket.emit('player-state', playerState);
	socket.emit('group-key', groupKey);

	socket.on('disconnect', () => {
		connectedUsers.splice(
			connectedUsers.findIndex((user) => user.id === userId),
			1,
		);
		io.emit('users', connectedUsers);
	});

	socket.on('set-songs', (songs: Song[]) => {
		triggerUserActivity(userId);
		io.emit('songs', songs);
	});

	socket.on('set-player-state', (state) => {
		triggerUserActivity(userId);
		playerState.isPlaying =
			state.isPlaying !== undefined ? state.isPlaying : playerState.isPlaying;
		playerState.currentProgress =
			state.currentProgress !== undefined
				? state.currentProgress
				: playerState.currentProgress;
		playerState.currentSongId =
			state.currentSongId !== undefined ? state.currentSongId : playerState.currentSongId;
		io.emit('player-state', playerState);
	});

	// Feature disabled
	// socket.on('set-username', (username: string) => {
	// 	const user = connectedUsers.find((user) => user.id === userId);
	// 	if (user) {
	// 		user.username = username;
	// 	}
	// 	io.emit('users', connectedUsers);
	// });

	socket.on('send-message', async (encryptedMessageContent: string, username: string) => {
		triggerUserActivity(userId);
		const newMessage = await db.message.create({
			data: { content: encryptedMessageContent, username },
		});
		io.emit('message', newMessage);
	});
});

const port = process.env.PORT || 4000;
const ip = getLocalNetworkIP();

server.listen({ port, host: ip }, () => {
	console.log(`Server is running on port http://${ip}:${port}`);
});
