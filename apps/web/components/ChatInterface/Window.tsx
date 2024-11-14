import type { Dispatch, SetStateAction } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send, Square, Mic, Loader2, Menu } from 'lucide-react';

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
import { MessageComponent } from '@/components/ChatInterface/MessageComponent';
import { useToast } from '@/hooks/use-toast';
import { ChatKey, ChatMessage } from '@/types/chat';
import { modelsOptions, defaultModel } from '@/lib/ai/models';

interface Props {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  selectedChat: string | null;
  hasErrored: boolean;
  suggestions: string[];
  onNewChat: (content: string) => Promise<string>;
  onSendMessage: (
    chatId: string,
    message: string,
    model: string
  ) => Promise<ChatMessage[]>;
  onReaction: (
    messageId: string,
    logId: string,
    reaction: string
  ) => Promise<void>;
  setSelectedChat: Dispatch<SetStateAction<string | null>>;
  setChatKeys: Dispatch<SetStateAction<ChatKey[]>>;
  models?: { id: string; name: string }[];
  onTranscribe: (audioBlob: Blob) => Promise<string>;
  isDesktop: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export function ChatWindow({
  messages,
  setMessages,
  isLoading,
  setIsLoading,
  selectedChat,
  hasErrored,
  suggestions,
  onNewChat,
  onSendMessage,
  onReaction,
  setSelectedChat,
  setChatKeys,
  models = modelsOptions,
  onTranscribe,
  isDesktop,
  isSidebarOpen,
  setIsSidebarOpen,
}: Props) {
  const { toast } = useToast();

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsTranscribing(true);
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

          const transcription = await onTranscribe(audioBlob);

          setInput(transcription);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to transcribe audio. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'Failed to access microphone. Please check your permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const isMobileSidebarOpen = !isDesktop && isSidebarOpen;

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <ScrollArea className={`flex-1 p-4 ${isMobileSidebarOpen ? 'blur' : ''}`}>
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
        ) : hasErrored ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                A
              </div>
              <h2 className="text-2xl font-semibold">
                Something has gone wrong...
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
              onReaction={(reaction) => {
                const content =
                  typeof message.content === 'string'
                    ? message.content
                    : message?.content?.prompt || '';

                return handleReaction(
                  message.id,
                  content,
                  message.logId || '',
                  reaction
                );
              }}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className={isMobileSidebarOpen ? 'blur' : ''}>
        {!hasErrored && !messages.length && !isLoading && (
          <div className="px-4 py-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                className="text-sm"
                onClick={() => handleSendMessage(suggestion)}
                disabled={isTranscribing || isLoading || isMobileSidebarOpen}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}

        {!hasErrored && (
          <div className="p-4 border-t space-y-4">
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={isTranscribing || isLoading || isMobileSidebarOpen}
            >
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
            {isTranscribing && (
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Transcribing audio...</span>
              </div>
            )}
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
                disabled={
                  isRecording ||
                  isTranscribing ||
                  isLoading ||
                  isMobileSidebarOpen
                }
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                disabled={isTranscribing || isLoading || isMobileSidebarOpen}
                onClick={isRecording ? stopRecording : startRecording}
                className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                {isRecording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isRecording ? 'Stop recording' : 'Start recording'}
                </span>
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={
                  !input.trim() ||
                  isTranscribing ||
                  isLoading ||
                  isMobileSidebarOpen
                }
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
