import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Mic, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

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
	const [input, setInput] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { isRecording, isTranscribing, startRecording, stopRecording } =
		useVoiceRecorder({ onTranscribe });

	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "0";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	useEffect(() => {
		adjustTextareaHeight();
	}, [input]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		await onSendMessage(input);
		setInput("");
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<Textarea
				ref={textareaRef}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Write a message..."
				className="flex-1 min-h-[40px] max-h-[200px] resize-none overflow-y-auto"
				disabled={isRecording || isTranscribing || isLoading || isDisabled}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						handleSubmit(e);
					}
				}}
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
