import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import db from '../prisma/database';

export const streamAudio = async (req: Request, res: Response): Promise<void> => {
	if (!req.params.id) {
		res.status(400).json({ message: 'Song ID is required' });
		return;
	}

	const song = await db.song.findUnique({ where: { id: req.params.id } });

	if (!song) {
		res.status(404).json({ message: 'Song not found' });
		return;
	}

	const audioPath = path.join(__dirname, '..', song.audio);
	const stat = fs.statSync(audioPath);
	const fileSize = stat.size;
	const range = req.headers.range; // It is set automatically by HTML <audio> element

	if (range) {
		const parts = range.replace(/bytes=/, '').split('-');
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

		const chunksize = end - start + 1;
		const file = fs.createReadStream(audioPath, { start, end });
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'audio/mpeg',
		};

		res.writeHead(206, head);
		file.pipe(res);
	} else {
		// If no range is provided, send the whole file at once
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'audio/mpeg',
		};

		res.writeHead(200, head);
		fs.createReadStream(audioPath).pipe(res);
	}
};
