import type { ChatList, ChatMessage } from '@/types/chat';

export async function getChatKeys({
  token,
}: {
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
  const url = `${baseUrl}/chat`;

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

  const keys = data?.response?.keys;

  if (!keys) {
    console.error('No keys found in response');
    return;
  }

  const chatList = keys?.map((chat) => {
    return {
      ...chat,
      id: chat.id || chat.name,
      title: chat.title || chat.name || '',
    };
  });

  return chatList;
}

export async function getChat({
  id,
  token,
  session,
}: {
  id: string;
  token: string;
  session?: any;
}): Promise<ChatMessage[]> {
  if (!token || !id) {
    console.error('No token or id provided');
    return [];
  }

  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8787'
      : 'https://assistant.nicholasgriffin.workers.dev';
  const url = `${baseUrl}/chat/${id}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'NGWeb',
      Authorization: `Bearer ${token}`,
      'x-user-email': session?.user?.email || '',
    },
  });

  if (!res.ok) {
    console.error('Error fetching data from AI', res.statusText);
    return [];
  }

  const data: ChatMessage[] = await res.json();

  return data;
}

export async function createChat({
  token,
  chatId,
  message,
  model,
  session,
}: {
  token: string;
  chatId: string;
  message: string;
  model?: string;
  session?: any;
}): Promise<ChatMessage[]> {
  if (!token || !chatId || !message) {
    console.error('No token provided');
    return [];
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
      'x-user-email': session?.user?.email || '',
    },
    body: JSON.stringify({
      chat_id: chatId,
      input:
        model === 'flux'
          ? {
              prompt: message,
            }
          : message,
      date: new Date().toISOString(),
      model: model || 'hermes-2-pro-mistral-7b',
    }),
  });

  if (!res.ok) {
    console.error('Error fetching data from AI', res.statusText);
    return [];
  }

  const data: ChatMessage[] = await res.json();

  return data;
}

export async function sendFeedback({
  token,
  logId,
  feedback,
}: {
  token: string;
  logId: string;
  feedback: string;
}): Promise<void> {
  if (!token || !logId || !feedback) {
    console.error('No token provided');
    return;
  }

  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8787'
      : 'https://assistant.nicholasgriffin.workers.dev';
  const res = await fetch(`${baseUrl}/chat/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'NGWeb',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      logId,
      feedback: feedback === 'positive' ? 1 : -1,
    }),
  });

  if (!res.ok) {
    console.error('Error fetching data from AI', res.statusText);
    return;
  }

  const data = await res.json();
}
