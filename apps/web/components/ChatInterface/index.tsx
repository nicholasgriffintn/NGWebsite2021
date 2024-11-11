'use client';

import * as React from 'react';
import { Copy, MessageSquare, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { ChatMessage, ChatKey, ChatModel } from '@/types/chat';

interface Props {
  initialChatKeys?: ChatKey[];
  models?: ChatModel[];
  onChatSelect?: (chatId: string) => Promise<any | ChatMessage[]>;
  onSendMessage?: (
    chatId: string,
    message: string,
    model: string
  ) => Promise<any | ChatMessage>;
  onReaction?: (messageId: string, reaction: string) => Promise<void>;
  onNewChat?: (content: string) => Promise<string>;
  suggestions?: string[];
}

export function ChatInterface({
  initialChatKeys = [],
  models = [
    { id: 'hermes-2-pro-mistral-7b', name: 'Hermes 2 Pro - Mistral 7B' },
    { id: 'llama-3.1-70b-instruct', name: 'Llama 3.1 - 70B Instruct' },
    { id: 'llama-3.2-3b-instruct', name: 'Llama 3.2 - 3B Instruct' },
  ],
  onChatSelect = async () => [],
  onSendMessage = async () => ({ id: '1', content: '', role: 'assistant' }),
  onReaction = async () => {},
  onNewChat = async () => 'new-chat-id',
  suggestions = ['What do you do?', 'Tell me a joke'],
}: Props) {
  const [chatKeys, setChatKeys] = React.useState<ChatKey[]>(initialChatKeys);
  const [selectedChat, setSelectedChat] = React.useState<string | null>(null);
  const [selectedModel, setSelectedModel] = React.useState<string>(
    models?.[0]?.id || ''
  );
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChatSelect = async (chatId: string) => {
    setIsLoading(true);
    setSelectedChat(chatId);
    setMessages([]); // Clear messages while loading
    try {
      const chatMessages = await onChatSelect(chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setInput('');
    const newUserMessage = {
      id: Date.now().toString(),
      content,
      role: 'user' as const,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { id: 'loading', content: '...', role: 'assistant' },
    ]);

    try {
      let chatId = selectedChat;
      if (!chatId) {
        chatId = await onNewChat(content);
        setSelectedChat(chatId);
        const newChatKey: ChatKey = {
          id: chatId,
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        };
        setChatKeys((prev) => [newChatKey, ...prev]);
      }
      const response = await onSendMessage(chatId, content, selectedModel);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== 'loading'),
        response,
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== 'loading'));
    }
    setIsLoading(false);
  };

  const handleNewChat = async () => {
    setSelectedChat(null);
    setMessages([]);
    try {
      const newChatId = await onNewChat('');
      setSelectedChat(newChatId);
      const newChatKey: ChatKey = {
        id: newChatId,
        title: 'New Chat',
      };
      setChatKeys((prev) => [newChatKey, ...prev]);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleCopy = async (id: string, content: string) => {
    try {
      onReaction(id, 'copy');
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copied to clipboard',
        description: 'The message has been copied to your clipboard.',
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: 'Copy failed',
        description:
          'There was an error copying the message to your clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background overflow-hidden">
      <div className="w-64 border-r bg-muted/20">
        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleNewChat}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            New Chat
          </Button>
          <hr className="border-t border-muted" />
          {chatKeys.length === 0 && (
            <p className="text-sm text-center">No previous chats were found.</p>
          )}
          {chatKeys.map((chat) => (
            <Button
              key={chat.id}
              variant={selectedChat === chat.id ? 'secondary' : 'ghost'}
              disabled={selectedChat === chat.id}
              className="w-full justify-start text-sm"
              onClick={() => handleChatSelect(chat.id)}
            >
              {chat.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {isLoading && !messages.length ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto animate-pulse">
                  A
                </div>
                <h2 className="text-2xl font-semibold">
                  {selectedChat
                    ? 'Please wait while I retrieve the chat history...'
                    : 'Starting a new chat...'}
                </h2>
              </div>
            </div>
          ) : !messages.length ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                  A
                </div>
                <h2 className="text-2xl font-semibold">
                  How can I help you today?
                </h2>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              if (!message.role) return null;

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
                      className={cn(
                        'rounded-lg px-4 py-2 max-w-[85%] space-y-2 relative',
                        {
                          'bg-primary text-primary-foreground':
                            message.role === 'user',
                          'bg-muted': message.role === 'assistant',
                        }
                      )}
                    >
                      <p className="text-sm mb-0">{message.content}</p>
                      {message.role === 'assistant' &&
                        message.id !== 'loading' && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleCopy(message.id, message.content)
                              }
                            >
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Copy message</span>
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                  {(message.timestamp || message.model) && (
                    <div className="absolute bottom-0 right-0 mb-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                      <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground">
                        {message.timestamp && (
                          <span>
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        )}
                        {message.model && (
                          <>
                            <span>•</span>
                            <span className="font-medium">{message.model}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {!messages.length && !isLoading && (
          <div className="px-4 py-2 grid grid-cols-2 gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                className="text-sm"
                onClick={() => handleSendMessage(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}

        <div className="p-4 border-t space-y-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message..."
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}