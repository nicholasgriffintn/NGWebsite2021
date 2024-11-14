'use client';

import { useState } from 'react';

import { ChatMessage, ChatKey, ChatModel } from '@/types/chat';
import { ChatSidebar } from '@/components/ChatInterface/Sidebar';
import { ChatWindow } from '@/components/ChatInterface/Window';

interface Props {
  initialChatKeys?: ChatKey[];
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
  hasErrored?: boolean;
  onTranscribe: (audioBlob: Blob) => Promise<string>;
}

export function ChatInterface({
  initialChatKeys = [],
  onChatSelect = async () => [],
  onSendMessage = async () => [],
  onReaction = async () => {},
  onNewChat = async () => 'new-chat-id',
  suggestions = ['What do you do?', 'Tell me a joke'],
  hasErrored = false,
  onTranscribe = async () => '',
}: Props) {
  const [chatKeys, setChatKeys] = useState<ChatKey[]>(initialChatKeys);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background overflow-hidden">
      <ChatSidebar
        selectedChat={selectedChat}
        chatKeys={chatKeys}
        handleChatSelect={handleChatSelect}
        handleNewChat={handleNewChat}
      />
      <ChatWindow
        messages={messages}
        setMessages={setMessages}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        hasErrored={hasErrored}
        selectedChat={selectedChat}
        suggestions={suggestions}
        onNewChat={onNewChat}
        onReaction={onReaction}
        onSendMessage={onSendMessage}
        setSelectedChat={setSelectedChat}
        setChatKeys={setChatKeys}
        onTranscribe={onTranscribe}
      />
    </div>
  );
}