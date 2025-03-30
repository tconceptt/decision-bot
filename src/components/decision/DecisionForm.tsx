import React, { FormEvent } from 'react';
import { Message, MAX_OPTIONS } from '@/types';
import { sendMessageToApi } from '@/utils/api';

interface DecisionFormProps {
  isLoading: boolean;
  numberOfOptions: number;
  setNumberOfOptions: (num: number) => void;
  decisionOptions: string[];
  setDecisionOptions: React.Dispatch<React.SetStateAction<string[]>>;
  decisionContext: string;
  setDecisionContext: (context: string) => void;
  setIsDecidingMode: (deciding: boolean) => void;
  setMessages: (updater: (prev: Message[]) => Message[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const DecisionForm = ({
  isLoading,
  numberOfOptions,
  setNumberOfOptions,
  decisionOptions,
  setDecisionOptions,
  decisionContext,
  setDecisionContext,
  setIsDecidingMode,
  setMessages,
  setIsLoading
}: DecisionFormProps) => {
  const handleOptionChange = (index: number, value: string) => {
    setDecisionOptions((prev: string[]) => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || decisionOptions.some(opt => !opt.trim())) return;

    const decisionPrompt = `
I need you to make a decisive choice between ${numberOfOptions} options. You MUST choose one option, even if the information is limited or the options seem similar.

My Options:
${decisionOptions.map((opt, index) => `${index + 1}. ${opt.trim()}`).join('\n')}

${decisionContext.trim() ? `\nAdditional Context:\n${decisionContext.trim()}\n` : ''}

Instructions:
1. You MUST choose exactly one option - no asking for clarifications or more information.
2. Start your response with "I choose Option X" where X is the number of your chosen option.
3. Then provide a brief explanation of why you chose that option, working with whatever information is available.
4. If options seem similar or information is limited, make reasonable assumptions to differentiate them.
5. Be confident and decisive in your choice, even if you have to make educated guesses.
`;

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: decisionPrompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get decision');
      }

      const data = await response.json();
      
      // Only add the AI's response to the message history
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'model', content: data.response }
      ]);
    } catch (error) {
      console.error('Error getting decision:', error);
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now(), 
          role: 'error', 
          content: error instanceof Error ? error.message : 'An unexpected error occurred.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }

    setIsDecidingMode(false);
    setDecisionOptions(Array(numberOfOptions).fill(''));
    setDecisionContext('');
  };

  return (
    <div className="mb-6 p-6 bg-[var(--background-tertiary)] rounded-xl shadow-2xl border-2 border-[var(--border-color)]">
      <h2 className="text-xl font-semibold mb-4 text-[var(--accent-color)]">Help Me Decide</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Number of Options Selector */}
        <div className="form-field">
          <label htmlFor="numberOfOptions" className="block text-base font-medium text-[var(--text-primary)] mb-2">
            How many options would you like to compare?
          </label>
          <select
            id="numberOfOptions"
            value={numberOfOptions}
            onChange={(e) => setNumberOfOptions(Number(e.target.value))}
            disabled={isLoading}
            className="w-full"
          >
            {[...Array(MAX_OPTIONS - 1)].map((_, i) => (
              <option key={i + 2} value={i + 2}>
                {i + 2} options
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Option Input Fields */}
        <div className="space-y-4">
          {decisionOptions.map((optionText, index) => (
            <div key={index} className="form-field">
              <label htmlFor={`option-${index}`} className="block text-base font-medium text-[var(--text-primary)] mb-2">
                Option {index + 1}:
              </label>
              <textarea
                id={`option-${index}`}
                rows={2}
                value={optionText}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Describe option ${index + 1}...`}
                required
                disabled={isLoading}
                className="w-full resize-none"
              />
            </div>
          ))}
        </div>

        {/* Optional Context Field */}
        <div className="form-field">
          <label htmlFor="decisionContext" className="block text-base font-medium text-[var(--text-primary)] mb-2">
            Additional Context (optional):
          </label>
          <textarea
            id="decisionContext"
            rows={3}
            value={decisionContext}
            onChange={(e) => setDecisionContext(e.target.value)}
            placeholder="Add any relevant context that might help with the decision (e.g., budget constraints, preferences, requirements...)"
            disabled={isLoading}
            className="w-full resize-vertical"
          />
        </div>

        {/* Decision Submit/Cancel Buttons */}
        <div className="flex justify-end space-x-4 pt-2">
          <button
            type="button"
            onClick={() => setIsDecidingMode(false)}
            disabled={isLoading}
            className="px-6 py-3 text-base font-medium rounded-lg text-[var(--text-primary)] bg-[var(--background-primary)] hover:bg-[var(--dropdown-hover)] border-2 border-[var(--border-color)] hover:border-[var(--accent-color)] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || decisionOptions.some(opt => !opt.trim())}
            className="px-6 py-3 text-base font-medium rounded-lg text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Thinking...' : 'Help Me Decide'}
          </button>
        </div>
      </form>
    </div>
  );
}; 