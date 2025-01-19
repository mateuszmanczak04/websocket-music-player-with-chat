import type { Request, Response } from 'express';
import db from '../prisma/database';

export const getMessages = async (req: Request, res: Response): Promise<void> => {
	try {
		const messages = await db.message.findMany({
			orderBy: {
				createdAt: 'asc',
			},
		});

		if (!messages) {
			res.status(404).json({ message: 'No messages found' });
			return;
		}

		res.status(200).json(messages);
	} catch {
		res.status(500).json({ message: 'Internal server error' });
	}
};
