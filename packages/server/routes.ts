import type { Request, Response } from 'express';

import { chatController } from './controllers/chat.controller';
import express from 'express';

const router = express.Router();

router.post('/api/chat', async (req: Request, res: Response) => {
  chatController.sendMessage(req, res);
});

export default router;
