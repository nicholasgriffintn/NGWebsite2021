'use client';

import * as React from 'react';
import { MessageSquarePlus, Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
}

export function ChatInterface({
  initialChats = [],
  onSendMessage = async () => {},
}: {
  initialChats?: Chat[];
  onSendMessage?: (
    chatId: string,
    message: string,
    model: string
  ) => Promise<void>;
}) {
  const [chats, setChats] = React.useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = React.useState<string | null>(null);
  const [input, setInput] = React.useState('');
  const [selectedModel, setSelectedModel] = React.useState('gpt-3.5-turbo');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Math.random().toString(36).substring(7),
      title: 'New Chat',
      messages: [],
      model: selectedModel,
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: Math.random().toString(36).substring(7),
              content: input,
              role: 'user' as const,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setInput('');

    await onSendMessage(activeChat, input, selectedModel);
  };

  const currentChat = chats.find((chat) => chat.id === activeChat);

  return (
    <div className="flex h-[calc(100vh-180px)] bg-background w-full">
      {/* Sidebar */}
      <div className="w-72 border-r border-border/50 bg-muted/10">
        <div className="p-4">
          <Button
            onClick={createNewChat}
            variant="secondary"
            className="w-full justify-start gap-2 bg-primary/10 hover:bg-primary/20"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-132px)]">
          <div className="space-y-1 p-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={cn(
                  'w-full rounded-lg px-4 py-3 text-left text-sm transition-colors hover:bg-accent/50',
                  activeChat === chat.id && 'bg-accent text-accent-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquarePlus className="h-4 w-4" />
                  <span className="line-clamp-1">{chat.title}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col bg-gradient-to-b from-background to-background/50">
        {activeChat ? (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentChat?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-2 max-w-[80%]',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-foreground'
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border/50 bg-background/50 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/50">
              <div className="mb-4">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude-2">Claude 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50"
                />
                <Button type="submit" size="icon" className="shrink-0">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center space-y-2">
              <MessageSquarePlus className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground">
                Select a chat or create a new one to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
