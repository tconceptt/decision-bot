export interface Message {
  id: number;
  role: 'user' | 'model' | 'loading' | 'error' | 'system';
  content: string;
}

export const MAX_OPTIONS = 5; 