import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useRef, useState, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type ChatFormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const conversationId = useRef(crypto.randomUUID());

  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const submit = async ({ prompt }: ChatFormData) => {
    setMessages((prev) => [...prev, prompt]);

    reset({ prompt: '' });

    const { data } = await axios.post<ChatResponse>('/api/chat', {
      prompt,
      conversationId: conversationId.current,
    });
    setMessages((prev) => [...prev, data.message]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(submit)();
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
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
        <Button
          disabled={!formState.isValid}
          className="rounded-full w-9 h-9"
          type="submit"
        >
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
