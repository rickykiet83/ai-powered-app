import type { Request, Response } from 'express';

import { chatController } from './controllers/chat.controller';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.post('/api/chat', async (req: Request, res: Response) => {
  chatController.sendMessage(req, res);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
