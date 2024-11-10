import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { PageLayout } from '@/components/PageLayout';
import { ChatInterface } from '@/components/ChatInterface';
import { InnerPage } from '@/components/InnerPage';
import { getChat, createChat } from '@/lib/data/chat';

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

    const response = await createChat({
      token,
      chatId,
      message,
      model,
    });

    return response;
  }

  return (
    <PageLayout>
      <InnerPage isFullPage>
        <div className="container">
          <ChatInterface
            initialChats={data.chatHistory}
            onSendMessage={onCreateChat}
          />
        </div>
      </InnerPage>
    </PageLayout>
  );
}
