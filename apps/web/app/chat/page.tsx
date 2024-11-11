import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { PageLayout } from '@/components/PageLayout';
import { ChatInterface } from '@/components/ChatInterface';
import { InnerPage } from '@/components/InnerPage';
import {
  getChatKeys,
  getChat,
  createChat,
  sendFeedback,
} from '@/lib/data/chat';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Chat',
  description: 'Start a chat with my assistant.',
};

async function validateToken() {
  const systemAuthToken = process.env.AUTH_TOKEN || '';
  if (!systemAuthToken) {
    return null;
  }

  const cookieStore = await cookies();
  const userAuthToken = cookieStore.get('authToken');
  const token = userAuthToken?.value;

  if (!token || token !== systemAuthToken) {
    return null;
  }

  return token;
}

async function getData() {
  const token = await validateToken();
  if (!token) {
    return notFound();
  }

  const chatHistory = await getChatKeys({ token });
  return { chatHistory };
}

export default async function Chat() {
  const data = await getData();

  async function onCreateChat(chatId: string, message: string, model: string) {
    'use server';

    const token = await validateToken();
    if (!token) {
      console.error('No token found');
      return [];
    }

    const response = await createChat({ token, chatId, message, model });
    return Array.isArray(response) ? response : [response];
  }

  async function onChatSelect(chatId: string) {
    'use server';

    const token = await validateToken();
    if (!token) {
      console.error('No token found');
      return [];
    }

    const chatMessages = await getChat({ token, id: chatId });
    return Array.isArray(chatMessages) ? chatMessages : [];
  }

  async function handleNewChat(content: string) {
    'use server';
    return Math.random().toString(36).substring(7);
  }

  async function handleReaction(
    chatId: string,
    logId: string,
    reaction: string
  ) {
    'use server';

    const token = await validateToken();
    if (!token) {
      return;
    }

    if (reaction === 'thumbsUp') {
      return await sendFeedback({ token, logId, feedback: 'positive' });
    }

    if (reaction === 'thumbsDown') {
      return await sendFeedback({ token, logId, feedback: 'negative' });
    }
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
            onReaction={handleReaction}
          />
        </div>
      </InnerPage>
    </PageLayout>
  );
}
