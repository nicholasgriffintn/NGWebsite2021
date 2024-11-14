import { cookies } from 'next/headers';
import Form from 'next/form';
import { revalidatePath } from 'next/cache';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

async function getData(token: string) {
  const chatHistory = await getChatKeys({ token });
  return { chatHistory };
}

export default async function Chat() {
  const token = await validateToken();

  async function logIn(formData: FormData) {
    'use server';

    const token = formData.get('token') as string;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set('authToken', token, {
        maxAge: 60 * 60 * 24 * 30,
      });
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
              <div className="text-primary-foreground lg:max-w-[100%] prose dark:prose-invert">
                <p>Enter your token to log in:</p>
                <Form action={logIn}>
                  <Label htmlFor="token">Token</Label>
                  <Input placeholder="Enter your token" name="token" />
                  <Button className="mt-5" type="submit">
                    Submit
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </InnerPage>
      </PageLayout>
    );
  }

  const data = await getData(token || '');

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
            onNewChat={handleNewChat}
            onReaction={handleReaction}
            onTranscribe={onTranscribe}
          />
        </div>
      </InnerPage>
    </PageLayout>
  );
}
