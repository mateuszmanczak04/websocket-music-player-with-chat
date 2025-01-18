import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
	createSong,
	deleteSong,
	getAllSongs,
	getSongById,
	updateSong,
} from './controllers/songController';

const app = express();
const port = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
	origin: 'http://localhost:3000',
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

app.get('/', (req: Request, res: Response) => {
	res.send('Hello, world!');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
