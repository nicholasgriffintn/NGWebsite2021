'use client';

import * as React from 'react';
import { Send, MessageSquare } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import { MessageComponent } from '@/components/ChatInterface/MessageComponent';
import { ChatMessage, ChatKey, ChatModel } from '@/types/chat';

interface Props {
  initialChatKeys?: ChatKey[];
  models?: ChatModel[];
  onChatSelect?: (chatId: string) => Promise<ChatMessage[]>;
  onSendMessage?: (
    chatId: string,
    message: string,
    model: string
  ) => Promise<ChatMessage[]>;
  onReaction?: (
    messageId: string,
    logId: string,
    reaction: string
  ) => Promise<void>;
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
  onSendMessage = async () => [],
  onReaction = async () => {},
  onNewChat = async () => 'new-chat-id',
  suggestions = ['What do you do?', 'Tell me a joke'],
}: Props) {
  const [chatKeys, setChatKeys] = React.useState<ChatKey[]>(initialChatKeys);
  const [selectedChat, setSelectedChat] = React.useState<string | null>(null);
  const [selectedModel, setSelectedModel] = React.useState<string>(
    models[0]?.id || ''
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

  const handleChatSelect = async (chatId: string) => {
    setIsLoading(true);
    setSelectedChat(chatId);
    setMessages([]);
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
    const newUserMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    const tempMessage: ChatMessage = {
      status: 'loading',
      id: 'temp-' + Math.random().toString(36).substring(7),
      role: 'assistant',
      content: 'thinking...',
    };
    setMessages((prev) => [...prev, tempMessage]);

    setIsLoading(true);
    try {
      const chatId = selectedChat || (await onNewChat(content));
      if (!selectedChat) {
        setSelectedChat(chatId);
        setChatKeys((prev) => [...prev, { id: chatId, title: content }]);
      }
      const responseMessages = await onSendMessage(
        chatId,
        content,
        selectedModel
      );

      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      setMessages((prev) => [...prev, ...responseMessages]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    }
    setIsLoading(false);
  };

  const handleReaction = async (
    messageId: string,
    content: string,
    logId: string,
    reaction: string
  ) => {
    try {
      await onReaction(messageId, logId, reaction);
      if (reaction === 'copy') {
        await navigator.clipboard.writeText(content);
        toast({
          title: 'Copied to clipboard',
          description: 'The message has been copied to your clipboard.',
        });
      } else {
        toast({
          title: 'Reaction recorded',
          description: 'Your reaction has been recorded.',
        });
      }
    } catch (err) {
      console.error('Failed to record reaction:', err);
      toast({
        title: 'Reaction failed',
        description: 'There was an error recording your reaction.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background overflow-hidden">
      <div className="w-64 border-r bg-muted/20 flex flex-col h-full">
        <div className="p-4 space-y-2 h-full">
          <div className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleNewChat}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
          <ScrollArea className="flex-1 h-[calc(100vh-340px)]">
            <div className="px-4 space-y-2">
              <hr className="border-t border-muted mb-2" />
              {chatKeys.length === 0 && (
                <p className="text-sm text-center">
                  No previous chats were found.
                </p>
              )}
              {chatKeys.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`w-full rounded p-2 text-left ${
                    selectedChat === chat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </ScrollArea>
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
            messages.map((message, index) => (
              <MessageComponent
                key={index}
                message={message}
                onReaction={(reaction) =>
                  handleReaction(
                    message.id,
                    message.content || '',
                    message.logId || '',
                    reaction
                  )
                }
              />
            ))
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