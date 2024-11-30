import { useState } from 'react';
import { Send, Loader2, Mic, Square } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onTranscribe: (audioBlob: Blob) => Promise<string>;
  isLoading: boolean;
  isDisabled: boolean;
}

export function ChatInput({
  onSendMessage,
  onTranscribe,
  isLoading,
  isDisabled,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const { isRecording, isTranscribing, startRecording, stopRecording } =
    useVoiceRecorder({ onTranscribe });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await onSendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write a message..."
        className="flex-1"
        disabled={isRecording || isTranscribing || isLoading || isDisabled}
      />

      {isRecording ? (
        <Button
          type="button"
          variant="destructive"
          onClick={stopRecording}
          disabled={isLoading || isDisabled}
        >
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={startRecording}
          disabled={isLoading || isDisabled}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}

      <Button type="submit" disabled={!input.trim() || isLoading || isDisabled}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
