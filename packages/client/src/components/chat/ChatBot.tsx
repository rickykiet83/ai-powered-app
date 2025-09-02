import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useRef, useState, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import TypingIndicator from './TypingIndicator';
import ChatMessages, { type Message } from './ChatMessages';

type ChatFormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const submit = async ({ prompt }: ChatFormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      setError('');

      reset({ prompt: '' });

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
      setIsBotTyping(false);
    } catch (error) {
      console.error(error);
      setError('Something went wrong, try again!');
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(submit)();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <form
        onSubmit={handleSubmit(submit)}
        onKeyDown={handleKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
          placeholder="Ask anything"
          className="w-full border-0 focus:outline-0 resize-none"
          autoFocus
          maxLength={1000}
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
