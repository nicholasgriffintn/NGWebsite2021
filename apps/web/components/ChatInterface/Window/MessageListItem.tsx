import { Fragment } from 'react';
import { ChatMessage } from '@/types/chat';
import { MessageComponent } from './MessageComponent';
import { DateSeparator } from '@/components/DateSeparator';

interface MessageListItemProps {
  message: ChatMessage;
  showDate: boolean;
  messageDate?: Date;
  onReaction: (reaction: string) => Promise<void>;
}

export function MessageListItem({
  message,
  showDate,
  messageDate,
  onReaction,
}: MessageListItemProps) {
  return (
    <Fragment key={message.id}>
      {showDate && <DateSeparator date={messageDate} />}
      <MessageComponent message={message} onReaction={onReaction} />
    </Fragment>
  );
}
