import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { PageLayout } from '@/components/PageLayout';
import { ChatInterface } from '@/components/ChatInterface';
import { InnerPage } from '@/components/InnerPage';

export const metadata = {
  title: 'Chat',
  description: 'Start a chat with my assistant.',
};

async function checkAuth() {
  const systemAuthToken = process.env.AUTH_TOKEN || '';

  if (!systemAuthToken) {
    return notFound();
  }

  const cookieStore = await cookies();
  const userAuthToken = cookieStore.get('authToken');

  if (!userAuthToken?.value) {
    return notFound();
  }

  if (userAuthToken.value !== systemAuthToken) {
    return notFound();
  }

  return userAuthToken.value;
}

export default async function Chat() {
  const auth = await checkAuth();

  return (
    <PageLayout>
      <InnerPage isFullPage>
        <div className="container">
          <ChatInterface />
        </div>
      </InnerPage>
    </PageLayout>
  );
}
