// src/app/page.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { DecisionForm } from '@/components/decision/DecisionForm';

export default function Home() {
  // --- State Variables ---
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for "Help Me Decide" feature
  const [isDecidingMode, setIsDecidingMode] = useState<boolean>(false);
  const [numberOfOptions, setNumberOfOptions] = useState<number>(2);
  const [decisionOptions, setDecisionOptions] = useState<string[]>(Array(numberOfOptions).fill(''));
  const [decisionContext, setDecisionContext] = useState<string>('');

  // --- Effects ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setDecisionOptions(Array(numberOfOptions).fill(''));
  }, [numberOfOptions]);

  return (
    <>
      {/* Header */}
      <header className="bg-[var(--background-secondary)] shadow-xl p-6 border-b border-[var(--border-color)] sticky top-0 z-10">
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-[var(--success-color)]">
          Abby&apos;s Little Helper ✨
          And T&apos;s slave
        </h1>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-grow overflow-y-auto p-6 space-y-6 bg-[var(--background-primary)] scroll-smooth">
        {messages.length === 0 && !isLoading && !isDecidingMode && (
          <div className="text-center text-[var(--text-secondary)] mt-20 text-lg">
            Type a message or click &quot;Help Me Decide&quot; below ✨
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Footer Area */}
      <footer className="bg-[var(--background-secondary)] p-6 border-t border-[var(--border-color)] shadow-inner sticky bottom-0 z-10">
        {/* Decision Mode UI */}
        {isDecidingMode && (
          <DecisionForm
            isLoading={isLoading}
            numberOfOptions={numberOfOptions}
            setNumberOfOptions={setNumberOfOptions}
            decisionOptions={decisionOptions}
            setDecisionOptions={setDecisionOptions}
            decisionContext={decisionContext}
            setDecisionContext={setDecisionContext}
            setIsDecidingMode={setIsDecidingMode}
            setMessages={setMessages}
            setIsLoading={setIsLoading}
          />
        )}

        {/* Toggle Button for Decision Mode */}
        <button
          onClick={() => setIsDecidingMode(!isDecidingMode)}
          disabled={isLoading}
          className={`w-full mb-4 px-6 py-3 text-base font-medium rounded-lg border-2 transition-all duration-200 ${
            isDecidingMode
              ? 'bg-[var(--background-primary)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--accent-color)]'
              : 'bg-[var(--accent-color)] text-white border-transparent hover:bg-[var(--accent-hover)]'
          }`}
        >
          {isDecidingMode ? 'Cancel Decision Helper' : '🤔 Help Me Decide'}
        </button>

        {/* Regular Chat Input Form */}
        {!isDecidingMode && (
          <ChatInput
            prompt={prompt}
            setPrompt={setPrompt}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setMessages={setMessages}
          />
        )}
      </footer>
    </>
  );
}