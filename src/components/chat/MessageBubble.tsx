import { Message } from '@/types';

export const MessageBubble = ({ message }: { message: Message }) => {
  switch (message.role) {
    case 'user':
    case 'system':
      return (
        <div key={message.id} className="flex justify-end mb-4">
          <div className={`message-container rounded-2xl py-3 px-5 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl shadow-lg break-words ${
            message.role === 'system' 
              ? 'border-2 border-[var(--accent-color)] text-[var(--text-primary)]' 
              : 'bg-[var(--accent-color)] text-white'
          }`}
          style={{
            backgroundColor: message.role === 'system' 
              ? `rgba(var(--accent-color-rgb), 0.2)`
              : undefined
          }}>
            {message.role === 'system' && (
              <strong className="block text-sm font-semibold mb-2 uppercase tracking-wide text-[var(--accent-color)]">
                Decision Request Sent:
              </strong>
            )}
            <pre className="whitespace-pre-wrap font-sans text-base">{message.content}</pre>
          </div>
        </div>
      );
    case 'model':
      return (
        <div key={message.id} className="flex justify-start mb-4 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
               style={{ backgroundColor: `rgba(var(--accent-color-rgb), 0.2)` }}>
            <span className="text-xl">✨</span>
          </div>
          <div className="message-container bg-[var(--background-tertiary)] text-[var(--text-primary)] rounded-2xl py-3 px-5 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl shadow-lg whitespace-pre-wrap break-words border-2 border-[var(--border-color)]">
            {message.content}
          </div>
        </div>
      );
    case 'loading':
      return (
        <div key={message.id} className="flex justify-start mb-4 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
               style={{ backgroundColor: `rgba(var(--accent-color-rgb), 0.2)` }}>
            <span className="text-xl">✨</span>
          </div>
          <div className="message-container bg-[var(--background-tertiary)] rounded-2xl py-3 px-5 shadow-lg flex items-center space-x-2 border-2 border-[var(--border-color)]">
            <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      );
    case 'error':
      return (
        <div key={message.id} className="flex justify-start mb-4 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
               style={{ backgroundColor: `rgba(var(--error-color-rgb), 0.2)` }}>
            <span className="text-xl">⚠️</span>
          </div>
          <div className="message-container rounded-2xl py-3 px-5 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl shadow-lg break-words border-2 border-[var(--error-color)] text-[var(--error-color)]"
               style={{ backgroundColor: `rgba(var(--error-color-rgb), 0.1)` }}>
            <p className="font-semibold text-base mb-1">Error</p>
            <p className="text-base opacity-90">{message.content}</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}; 