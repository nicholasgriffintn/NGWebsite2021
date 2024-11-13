import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import { PageLayout } from '@/components/PageLayout';
import { ChatInterface } from '@/components/ChatInterface';
import { InnerPage } from '@/components/InnerPage';
import {
  getChatKeys,
  getChat,
  createChat,
  sendFeedback,
} from '@/lib/data/chat';
import { auth0 } from '@/lib/auth0';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Chat',
  description: 'Start a chat with my assistant.',
};

async function getData(token) {
  const chatHistory = await getChatKeys({ token });
  return { chatHistory };
}

export default withPageAuthRequired(
  async function Chat() {
    const session = await auth0.getSession();

    const token = process.env.AUTH_TOKEN || '';
    const data = await getData(token);

    async function onCreateChat(
      chatId: string,
      message: string,
      model: string
    ) {
      ('use server');

      const response = await createChat({
        token,
        chatId,
        message,
        model,
        session,
      });
      return Array.isArray(response) ? response : [response];
    }

    async function onChatSelect(chatId: string) {
      ('use server');

      const chatMessages = await getChat({ token, id: chatId, session });
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
      ('use server');

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
  },
  { returnTo: '/chat' }
);
