import React from 'react';
import { ThumbsUp, ThumbsDown, Hammer, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { WeatherCard } from '@/components/ChatInterface/Cards/WeatherCard';
import { ChatMessage } from '@/types/chat';

interface MessageProps {
  message: ChatMessage;
  onReaction: (reaction: string) => void;
}

export function MessageComponent({ message, onReaction }: MessageProps) {
  const isToolCall = message.tool_calls?.length;

  if (isToolCall) {
    return (
      <div key={message.id} className="mb-4 group relative">
        <div
          className={cn('flex items-start gap-3', {
            'justify-end': message.role === 'user',
          })}
        >
          <p className="text-sm mb-0 text-muted-foreground flex">
            <Hammer className="h-4 w-4 mr-2" />
            Used tool(s):{' '}
            {message.tool_calls?.map((tool_call) => (
              <span key={`${message.id}_${tool_call.name}`} className="text-sm">
                {tool_call.name}
              </span>
            ))}
          </p>
        </div>
      </div>
    );
  }

  if (!message.role || !message.content) {
    return null;
  }

  const formattedContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const isFunction = message.name;

  return (
    <div key={message.id} className="mb-4 group relative">
      <div
        className={cn('flex items-start gap-3', {
          'justify-end': message.role === 'user',
        })}
      >
        {message.role === 'assistant' && (
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-muted">
            A
          </div>
        )}
        <div
          className={cn('rounded-lg px-4 py-2 max-w-[85%] space-y-2 relative', {
            'bg-primary text-primary-foreground': message.role === 'user',
            'bg-muted': message.role === 'assistant',
          })}
        >
          <p className="text-sm mb-0">{formattedContent(message.content)}</p>
          {isFunction && message.name === 'get_weather' && message.data && (
            <WeatherCard data={message.data} />
          )}
          {message.role === 'assistant' && message.status !== 'loading' && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 transition-all duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground hover:scale-110"
                onClick={() => onReaction('copy')}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy message</span>
              </Button>
              {message.logId && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 transition-all duration-200 ease-in-out hover:bg-green-500 hover:text-white hover:scale-110"
                    onClick={() => onReaction('thumbsUp')}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="sr-only">Upvote Response</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 transition-all duration-200 ease-in-out hover:bg-red-500 hover:text-white hover:scale-110"
                    onClick={() => onReaction('thumbsDown')}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="sr-only">Downvote Response</span>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {message.timestamp && (
        <div
          className={`absolute top-full ${
            message.role === 'assistant' ? 'left-0' : 'right-0'
          } mt-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-10`}
        >
          <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground">
            {message.timestamp && (
              <span>{new Date(message.timestamp).toLocaleString()}</span>
            )}
            {message.model && (
              <>
                <span>•</span>
                <span className="font-medium">{message.model}</span>
              </>
            )}
            {message.logId && (
              <>
                <span>•</span>
                <span className="font-medium">{message.logId}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
