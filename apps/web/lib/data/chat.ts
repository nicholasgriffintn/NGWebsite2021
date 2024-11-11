import type { ChatList } from '@/types/chat';
import { baseUrl } from '../../app/sitemap';

export async function getChat({
  id,
  token,
}: {
  id?: string;
  token: string;
}): Promise<ChatList | undefined> {
  if (!token) {
    console.error('No token provided');
    return;
  }

  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8787'
      : 'https://assistant.nicholasgriffin.workers.dev';
  const url = `${baseUrl}/chat${id ? `/${id}` : ''}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'NGWeb',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error('Error fetching data from AI', res.statusText);
    return;
  }

  const data: any = await res.json();

  if (id) {
    return data.response;
  }

  const keys = data?.response?.keys;

  if (!keys) {
    console.error('No keys found in response');
    return;
  }

  const chatList = keys?.map((chat) => {
    return {
      ...chat,
      id: chat.name,
      title: chat.title || chat.name || '',
    };
  });

  return chatList;
}

export async function createChat({
  token,
  chatId,
  message,
  model,
}: {
  token: string;
  chatId: string;
  message: string;
  model?: string;
}): Promise<string> {
  if (!token || !chatId || !message) {
    console.error('No token provided');
    return '';
  }

  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8787'
      : 'https://assistant.nicholasgriffin.workers.dev';
  const res = await fetch(`${baseUrl}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'NGWeb',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      chat_id: chatId,
      input: message,
      date: new Date().toISOString(),
      model: model || 'hermes-2-pro-mistral-7b',
    }),
  });

  if (!res.ok) {
    console.error('Error fetching data from AI', res.statusText);
    return '';
  }

  const data: {
    response: string;
  } = await res.json();

  return data.response;
}
