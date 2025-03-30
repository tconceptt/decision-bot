import { FormEvent } from 'react';
import { Message } from '@/types';
import { sendMessageToApi } from '@/utils/api';

interface ChatInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setMessages: (updater: (prev: Message[]) => Message[]) => void;
}

export const ChatInput = ({
  prompt,
  setPrompt,
  isLoading,
  setIsLoading,
  setMessages
}: ChatInputProps) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    await sendMessageToApi(prompt, 'user', setIsLoading, setMessages);
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-grow min-w-0 text-lg"
      />
      <button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className="p-3 rounded-lg bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
}; 