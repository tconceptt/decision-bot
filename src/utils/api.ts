import { Message } from '@/types';

export const sendMessageToApi = async (
  messageContent: string,
  messageRole: Message['role'] = 'user',
  setIsLoading: (loading: boolean) => void,
  setMessages: (updater: (prev: Message[]) => Message[]) => void
) => {
  setIsLoading(true);
  const userOrSystemMessage: Message = { id: Date.now(), role: messageRole, content: messageContent };
  const loadingMessage: Message = { id: Date.now() + 1, role: 'loading', content: '...' };
  setMessages((prev) => [...prev, userOrSystemMessage, loadingMessage]);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: messageContent }),
    });

    setMessages((prev) => prev.filter((msg) => msg.role !== 'loading'));

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Failed to parse error response." }));
      throw new Error(errorData.error || `API request failed: ${res.statusText} (${res.status})`);
    }

    const data = await res.json();
    const modelMessage: Message = { id: Date.now(), role: 'model', content: data.response };
    setMessages((prev) => [...prev, modelMessage]);

  } catch (err: any) {
    console.error("API Fetch Error:", err);
    setMessages((prev) => prev.filter((msg) => msg.role !== 'loading'));
    const errorMessage: Message = { 
      id: Date.now(), 
      role: 'error', 
      content: err.message || 'An unexpected error occurred.' 
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
}; 