import type { Request, Response } from 'express';
import express from 'express';
import {
	createSong,
	deleteSong,
	getAllSongs,
	getSongById,
	updateSong,
} from './controllers/songController';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/songs', getAllSongs);
app.get('/songs/:id', getSongById);
app.post('/songs', createSong);
app.put('/songs/:id', updateSong);
app.delete('/songs/:id', deleteSong);

app.get('/', (req: Request, res: Response) => {
	res.send('Hello, world!');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
