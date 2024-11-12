import React from 'react';
import { ThumbsUp, ThumbsDown, Hammer, Copy, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { WeatherCard } from '@/components/ChatInterface/Cards/WeatherCard';
import type { ChatMessage } from '@/types/chat';

interface MessageProps {
  message: ChatMessage;
  onReaction: (reaction: string) => void;
}

const ToolCallMessage = ({ message }: { message: ChatMessage }) => (
  <div key={message.id} className="mb-4 group relative">
    <div
      className={cn('flex items-start gap-3', {
        'justify-end': message.role === 'user',
      })}
    >
      <p className="text-sm mb-0 text-muted-foreground flex items-center">
        <Hammer className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="truncate">
          Used tool(s):{' '}
          {message.tool_calls?.map((tool_call) => tool_call.name).join(', ')}
        </span>
      </p>
    </div>
  </div>
);

const replaceCitations = (text: string, citations: string[]) => {
  return text.replace(/\[(\d+)\]/g, (match, number) => {
    const index = parseInt(number, 10) - 1;
    if (citations[index]) {
      return `<a href="${citations[index]}" target="_blank" rel="noopener noreferrer">[${number}]</a>`;
    }
    return match;
  });
};

const FormattedContent = ({
  content,
  citations,
}: {
  content: string;
  citations: string[];
}) => (
  <div className="break-words whitespace-pre-wrap">
    {content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {replaceCitations(line, citations)}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))}
  </div>
);

const AnalysisContent = ({
  content,
  citations,
}: {
  content: string;
  citations: string[];
}) => {
  const [_, answer] = content.split('</analysis>');
  const cleanedAnswer =
    (answer &&
      answer.replace('<answer>', '').replace('</answer>', '').trim()) ||
    null;

  if (!cleanedAnswer) {
    return null;
  }

  return (
    <div className="flex-grow prose dark:prose-invert overflow-hidden">
      <div className="break-words">
        {replaceCitations(cleanedAnswer, citations)}
      </div>
    </div>
  );
};

const MessageContent = ({
  message,
  content,
  onReaction,
}: {
  message: ChatMessage;
  content: string;
  onReaction: (reaction: string) => void;
}) => {
  const isFunction = message.name;

  if (!content) {
    return null;
  }

  const cleanedAnalysis =
    (content.includes('<analysis>') &&
      content.split('</analysis>')?.[0]?.replace('<analysis>', '').trim()) ||
    null;

  console.log(message);

  return (
    <div
      className={cn(
        'rounded-lg px-4 py-2 max-w-[85%] space-y-2 relative overflow-hidden',
        {
          'bg-primary text-primary-foreground': message.role === 'user',
          'bg-muted': message.role === 'assistant',
        }
      )}
    >
      <div className="overflow-x-auto">
        {message.role === 'assistant' &&
        content.includes('<analysis>') &&
        content.includes('<answer>') ? (
          <AnalysisContent
            content={content}
            citations={message.citations || []}
          />
        ) : (
          <FormattedContent
            content={content}
            citations={message.citations || []}
          />
        )}
        {isFunction && message.data && (
          <div className="pt-2">
            {message.name === 'get_weather' && (
              <WeatherCard data={message.data} />
            )}
            {message.name === 'create_image' && (
              <>
                {message.data.output.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Generated image for prompt ${message.data.input.prompt}`}
                    width={message.data.input.width}
                    height={message.data.input.height}
                    className="rounded-md"
                    loading="lazy"
                  />
                ))}
              </>
            )}
            {message.name === 'create_video' && (
              <>
                {message.data.output.map((video, index) => (
                  <video
                    key={index}
                    controls
                    className="rounded-md"
                    width={message.data.input.width}
                    height={message.data.input.height}
                  >
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </>
            )}
            {message.name === 'create_audio' && (
              <>
                {message.data.output.map((audio, index) => (
                  <audio key={index} controls className="rounded-md">
                    <source src={audio} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      {message.role === 'assistant' && message.status !== 'loading' && (
        <div className="flex gap-2 pt-2">
          {cleanedAnalysis && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 transition-all duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground hover:scale-110"
                  aria-label="View analysis"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-60 overflow-scroll">
                <div className="font-medium">Analysis</div>
                <p className="mt-2 text-sm break-words">{cleanedAnalysis}</p>
              </PopoverContent>
            </Popover>
          )}
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
  );
};

const MessageTimestamp = ({ message }: { message: ChatMessage }) => (
  <div
    className={cn(
      'absolute top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-10',
      {
        'left-0': message.role === 'assistant',
        'right-0': message.role === 'user',
      }
    )}
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
);

export function MessageComponent({ message, onReaction }: MessageProps) {
  if (message.tool_calls?.length) {
    return <ToolCallMessage message={message} />;
  }

  const content = Array.isArray(message.content)
    ? message.content.join('\n')
    : typeof message.content === 'string'
    ? message.content
    : message?.content?.prompt || '';

  if (!message.role || !content) {
    return null;
  }

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
        <MessageContent
          message={message}
          content={content}
          onReaction={onReaction}
        />
      </div>
      {message.timestamp && <MessageTimestamp message={message} />}
    </div>
  );
}