import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

type ChatResponse = {
  id: string;
  message: string;
};

async function sendMessage(
  prompt: string,
  conversationId: string
): Promise<ChatResponse> {
  const response = await client.responses.create({
    // models: https://platform.openai.com/docs/models/compare?model=o4-mini
    model: 'gpt-4o-mini',
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 200,
    previous_response_id:
      conversationRepository.getLastResponseId(conversationId),
  });

  conversationRepository.setLastResponseId(conversationId, response.id);

  return {
    id: response.id,
    message: response.output_text,
  };
}

// public interface
export const chatService = {
  sendMessage,
};
