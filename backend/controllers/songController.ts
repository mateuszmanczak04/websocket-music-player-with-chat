import type { Request, Response } from 'express';
import db from '../prisma/database';

export const getAllSongs = async (_req: Request, res: Response): Promise<void> => {
	try {
		const songs = await db.song.findMany();
		res.status(200).json(songs);
	} catch {
		res.status(500).json({ message: 'Server error' });
	}
};

export const getSongById = async (req: Request, res: Response): Promise<void> => {
	if (!req.params.id) {
		res.status(400).json({ message: 'Song ID is required' });
		return;
	}

	try {
		const song = await db.song.findUnique({ where: { id: req.params.id } });
		if (!song) {
			res.status(404).json({ message: 'Song not found' });
			return;
		}

		res.status(200).json(song);
	} catch {
		res.status(500).json({ message: 'Server error' });
	}
};

// Create a new song
export const createSong = async (req: Request, res: Response): Promise<void> => {
	const { title, audio } = req.body;
	const cover = req.file as Express.Multer.File;

	if (!title || title.trim().length === 0 || !audio || audio.trim().length === 0 || !cover) {
		res.status(400).json({ message: 'Bad request' });
		return;
	}

	try {
		const newSong = await db.song.create({ data: { title, audio, cover: cover.path } });

		res.status(201).json(newSong);
	} catch {
		res.status(500).json({ message: 'Server error' });
	}
};

// Update an existing song
export const updateSong = async (req: Request, res: Response): Promise<void> => {
	if (!req.params.id) {
		res.status(400).json({ message: 'Song ID is required' });
		return;
	}

	try {
		const updatedSong = await db.song.update({
			where: { id: req.params.id },
			data: { title: req.body.title, audio: req.body.audio, cover: req.body.cover },
		});

		if (!updatedSong) {
			res.status(404).json({ message: 'Song not found' });
			return;
		}

		res.status(200).json(updatedSong);
	} catch {
		res.status(500).json({ message: 'Server error' });
	}
};

// Delete a song
export const deleteSong = async (req: Request, res: Response): Promise<void> => {
	if (!req.params.id) {
		res.status(400).json({ message: 'Song ID is required' });
		return;
	}

	try {
		const song = await db.song.findUnique({ where: { id: req.params.id } });

		if (!song) {
			res.status(404).json({ error: 'Song not found' });
			return;
		}

		await db.song.delete({ where: { id: req.params.id } });
		res.status(200).json({ message: 'Song deleted successfully' });
	} catch {
		res.status(500).json({ message: 'Server error' });
	}
};
