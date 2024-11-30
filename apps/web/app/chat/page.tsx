import { revalidatePath } from 'next/cache';

import { PageLayout } from '@/components/PageLayout';
import { ChatInterface } from '@/components/ChatInterface';
import { InnerPage } from '@/components/InnerPage';
import {
  getChatKeys,
  getChat,
  createChat,
  sendFeedback,
  sendTranscription,
} from '@/lib/data/chat';
import { validateToken, logIn } from '@/lib/auth';
import { LoginForm } from '@/components/ChatInterface/LoginForm';
import { ChatMode, ChatRole } from '../../types/chat';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Chat',
  description: 'Start a chat with my assistant.',
};

async function getData(token: string) {
  const chatHistory = await getChatKeys({ token });
  return { chatHistory };
}

export default async function Chat() {
  const token = await validateToken();

  async function handleLogIn(formData: FormData) {
    'use server';
    const token = formData.get('token') as string;
    if (token) {
      await logIn(token);
      revalidatePath('/chat');
    }
  }

  if (!token) {
    return (
      <PageLayout>
        <InnerPage>
          <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
            Unauthorized
          </h1>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 md:col-span-3 lg:col-span-3 pt-5">
              <p className="text-red-600">
                Access denied. Please enter a valid token.
              </p>
              <LoginForm onSubmit={handleLogIn} />
            </div>
          </div>
        </InnerPage>
      </PageLayout>
    );
  }

  const data = await getData(token || '');

  async function onCreateChat(
    chatId: string,
    message: string,
    model: string,
    mode: ChatMode = 'remote',
    role: ChatRole = 'user'
  ) {
    'use server';

    const token = await validateToken();
    if (!token) {
      console.error('No token found');
      return [];
    }

    const response = await createChat({
      token,
      chatId,
      message,
      model,
      mode,
      role,
    });
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

  async function onNewChat(content: string) {
    'use server';

    if (!content) {
      return `New chat (${Math.random().toString(36).substring(7)})`;
    }

    const shortContent = content.trim().substring(0, 36);
    const contentTitle = `${shortContent}${
      content.length > shortContent.length ? '...' : ''
    }`;
    return contentTitle;
  }

  async function onReaction(chatId: string, logId: string, reaction: string) {
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

  async function onTranscribe(audio: Blob) {
    'use server';

    const token = await validateToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await sendTranscription({
      token,
      audio,
    });

    if (!response) {
      throw new Error('No response from the model');
    }

    return response;
  }

  return (
    <PageLayout>
      <InnerPage isFullPage>
        <div className="container">
          <ChatInterface
            initialChatKeys={data.chatHistory}
            onSendMessage={onCreateChat}
            onChatSelect={onChatSelect}
            onNewChat={onNewChat}
            onReaction={onReaction}
            onTranscribe={onTranscribe}
          />
        </div>
      </InnerPage>
    </PageLayout>
  );
}
