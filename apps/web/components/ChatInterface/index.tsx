'use client';

import { useState, useEffect } from 'react';

import type { ChatMessage, ChatKey, ChatMode } from '@/types/chat';
import { ChatSidebar } from '@/components/ChatInterface/Sidebar';
import { ChatWindow } from '@/components/ChatInterface/Window';

interface Props {
  initialChatKeys?: ChatKey[];
  onChatSelect?: (chatId: string) => Promise<ChatMessage[]>;
  onSendMessage?: (
    chatId: string,
    message: string,
    model: string,
    mode?: ChatMode
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
  const [isDesktop, setIsDesktop] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('remote');

  const handleNewChat = async () => {
    setSelectedChat(null);
    setMessages([]);
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

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-[calc(100vh-120px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] bg-background overflow-hidden">
      <div
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } md:block md:w-64 flex-shrink-0`}
      >
        <ChatSidebar
          selectedChat={selectedChat}
          chatKeys={chatKeys}
          handleChatSelect={handleChatSelect}
          handleNewChat={handleNewChat}
        />
      </div>
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
        isDesktop={isDesktop}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
}