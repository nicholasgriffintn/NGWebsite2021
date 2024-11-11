import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { PageLayout } from '@/components/PageLayout';
import { ChatInterface } from '@/components/ChatInterface';
import { InnerPage } from '@/components/InnerPage';
import { getChat, createChat } from '@/lib/data/chat';
import { ChatRole } from '@/types/chat';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Chat',
  description: 'Start a chat with my assistant.',
};

async function getData() {
  const systemAuthToken = process.env.AUTH_TOKEN || '';

  if (!systemAuthToken) {
    return notFound();
  }

  const cookieStore = await cookies();
  const userAuthToken = cookieStore.get('authToken');
  const token = userAuthToken?.value;

  if (!token) {
    return notFound();
  }

  if (token !== systemAuthToken) {
    return notFound();
  }

  const chatHistory = await getChat({
    token,
  });

  return {
    chatHistory,
  };
}

export default async function Chat() {
  const data = await getData();

  async function onCreateChat(chatId: string, message: string, model: string) {
    'use server';

    const systemAuthToken = process.env.AUTH_TOKEN || '';

    if (!systemAuthToken) {
      return {};
    }

    const cookieStore = await cookies();
    const userAuthToken = cookieStore.get('authToken');
    const token = userAuthToken?.value;

    if (!token) {
      return {};
    }

    if (token !== systemAuthToken) {
      return {};
    }

    const response = await createChat({
      token,
      chatId,
      message,
      model,
    });

    return {
      id: Math.random().toString(36).substring(7),
      content: response,
      role: 'assistant' as ChatRole,
    };
  }

  async function onChatSelect(chatId: string) {
    'use server';

    console.log('Selecting chat', chatId);

    const systemAuthToken = process.env.AUTH_TOKEN || '';

    if (!systemAuthToken) {
      return {};
    }

    const cookieStore = await cookies();
    const userAuthToken = cookieStore.get('authToken');
    const token = userAuthToken?.value;

    if (!token) {
      return {};
    }

    if (token !== systemAuthToken) {
      return {};
    }

    const response = await getChat({
      token,
      id: chatId,
    });

    return response;
  }

  async function handleNewChat(content: string) {
    'use server';

    return Math.random().toString(36).substring(7);
  }

  return (
    <PageLayout>
      <InnerPage isFullPage>
        <div className="container">
          <ChatInterface
            initialChatKeys={data.chatHistory}
            onSendMessage={onCreateChat}
            onChatSelect={onChatSelect}
            onNewChat={handleNewChat}
          />
        </div>
      </InnerPage>
    </PageLayout>
  );
}
