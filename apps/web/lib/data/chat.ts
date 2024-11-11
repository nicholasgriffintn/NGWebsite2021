import type { ChatList } from '@/types/chat';

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

  const url = `https://assistant.nicholasgriffin.workers.dev/chat${
    id ? `/${id}` : ''
  }`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'NGWeb',
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate: 60,
    },
  });

  if (!res.ok) {
    console.error('Error fetching data from GitHub', res.statusText);
    return;
  }

  const data: any = await res.json();

  console.log('Chat data', data);

  if (id) {
    return data.response;
  }

  const chatList = data?.response?.keys?.map((chat) => {
    return {
      ...chat,
      id: chat.id || Math.random().toString(36).substring(7),
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

  console.log('Creating chat', chatId, message);

  const res = await fetch(
    `https://assistant.nicholasgriffin.workers.dev/chat`,
    {
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
        location: {},
      }),
    }
  );

  if (!res.ok) {
    console.error('Error fetching data from GitHub', res.statusText);
    return '';
  }

  const data: {
    response: string;
  } = await res.json();

  return data.response;
}
