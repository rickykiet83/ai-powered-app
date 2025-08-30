import type { Request, Response } from 'express';

import { chatService } from './services/chat.service';
import dotenv from 'dotenv';
import express from 'express';
import z from 'zod';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters)'),
  conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parseResult = chatSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json(z.treeifyError(parseResult.error));
    return;
  }

  try {
    const { prompt, conversationId } = req.body;

    const response = await chatService.sendMessage(prompt, conversationId);

    res.json({ message: response.message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate a response.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
