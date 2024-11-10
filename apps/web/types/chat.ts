export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export type ChatItem = {
  id: string;
  title: string;
  name?: string;
  messages?: ChatMessage[];
  model: string;
};

export type ChatList = ChatItem[];
