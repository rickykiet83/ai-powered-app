import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import type { KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';

type ChatFormData = {
  prompt: string;
};

const ChatBot = () => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const submit = (data: ChatFormData) => {
    console.log(data);
    reset({ prompt: '' });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(submit)();
    }
  };

  return (
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
  );
};

export default ChatBot;
