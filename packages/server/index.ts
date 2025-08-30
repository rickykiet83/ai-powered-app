import type { Request, Response } from 'express';

import OpenAI from 'openai';
import { conversationRepository } from './repositories/conversation.repository';
import dotenv from 'dotenv';
import express from 'express';
import z from 'zod';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

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

    // models: https://platform.openai.com/docs/models/compare?model=o4-mini
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    res.json({ message: response.output_text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate a response.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
