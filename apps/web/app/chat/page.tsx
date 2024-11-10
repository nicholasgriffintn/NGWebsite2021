import { PageLayout } from '@/components/PageLayout';
import { ChatInterface } from '@/components/ChatInterface';
import { InnerPage } from '@/components/InnerPage';

export const metadata = {
  title: 'Chat',
  description: 'Start a chat with my assistant.',
};

export default function Chat() {
  return (
    <PageLayout>
      <InnerPage>
        <ChatInterface />
      </InnerPage>
    </PageLayout>
  );
}
