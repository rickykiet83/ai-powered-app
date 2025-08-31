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

type Message = {
  content: string;
  role: 'user' | 'bot';
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const conversationId = useRef(crypto.randomUUID());

  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const submit = async ({ prompt }: ChatFormData) => {
    setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);

    reset({ prompt: '' });

    const { data } = await axios.post<ChatResponse>('/api/chat', {
      prompt,
      conversationId: conversationId.current,
    });
    setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(submit)();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 items-end mb-10">
        {messages.map((message, index) => (
          <p
            key={index}
            className={`px-3 py-1 rounded-xl ${
              message.role === 'user'
                ? 'bg-blue-600 text-white self-end'
                : 'bg-gray-100 text-black self-start'
            }`}
          >
            {message.content}
          </p>
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
