import type { Request, Response } from 'express';
import express from 'express';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello, world!');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
