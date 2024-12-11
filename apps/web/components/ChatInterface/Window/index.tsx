import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { ChatKey, ChatMessage, ChatMode } from "@/types/chat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ModelSelector } from "./ModelSelector";
import { ModeSelector } from "./ModeSelector";
import { Suggestions } from "./Suggestions";
import { WebLLMService } from "@/lib/ai/web-llm";

import { modelsOptions, defaultModel } from "@/lib/ai/models";

const localModels = modelsOptions.filter((model) => model.isLocal);
const remoteModels = modelsOptions.filter((model) => !model.isLocal);

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
		model: string,
		mode?: ChatMode,
	) => Promise<ChatMessage[]>;
	onReaction: (
		messageId: string,
		content: string,
		logId: string,
		reaction: string,
	) => Promise<void>;
	setSelectedChat: Dispatch<SetStateAction<string | null>>;
	setChatKeys: Dispatch<SetStateAction<ChatKey[]>>;
	models?: { id: string; name: string }[];
	onTranscribe: (audioBlob: Blob) => Promise<string>;
	isDesktop: boolean;
	isSidebarOpen: boolean;
	setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
	mode?: ChatMode;
	setMode: (mode: ChatMode) => void;
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
	mode = "remote",
	setMode,
}: Props) {
	const { toast } = useToast();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [selectedModel, setSelectedModel] = useState<string>(defaultModel);
	const [isInitializing, setIsInitializing] = useState(false);
	const [initProgress, setInitProgress] = useState<string>("");
	const [webLLM, setWebLLM] = useState<WebLLMService | null>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = async (content: string) => {
		if (!content.trim() || isLoading) return;

		setIsLoading(true);

		const newUserMessage: ChatMessage = {
			id: Math.random().toString(36).substring(7),
			role: "user",
			content,
			timestamp: Date.now(),
		};
		setMessages((prev) => [...prev, newUserMessage]);

		const assistantMessage: ChatMessage = {
			id: Math.random().toString(36).substring(7),
			role: "assistant",
			content: "...",
			model: selectedModel,
			timestamp: Date.now(),
		};
		setMessages((prev) => [...prev, assistantMessage]);

		try {
			if (mode === "local") {
				if (!webLLM) throw new Error("Local model not initialized");
				if (webLLM.getCurrentModel() !== selectedModel) {
					await webLLM.resetChat();
					await webLLM.init(selectedModel, (report) => {
						setInitProgress(
							`Loading model... ${(report.progress * 100).toFixed(2)}%`,
						);
					});
				}

				const chatId = selectedChat || (await onNewChat(content));
				if (!selectedChat) {
					setSelectedChat(chatId);
					setChatKeys((prev) => [...prev, { id: chatId, title: content }]);
				}

				await webLLM.generate(chatId, content, onSendMessage, (delta) => {
					setMessages((prev) => {
						const lastMessage = prev[prev.length - 1];
						const newContent =
							lastMessage?.content === "..."
								? delta
								: lastMessage?.content + delta;

						return [
							...prev.slice(0, -1),
							{
								...lastMessage,
								content: newContent,
							} as ChatMessage,
						];
					});
				});
			} else {
				const chatId = selectedChat || (await onNewChat(content));
				if (!selectedChat) {
					setSelectedChat(chatId);
					setChatKeys((prev) => [...prev, { id: chatId, title: content }]);
				}
				const response = await onSendMessage(
					chatId,
					content,
					selectedModel,
					mode,
				);

				setMessages((prev) => {
					const withoutPlaceholder = prev.slice(0, -1);
					return [...withoutPlaceholder, ...response];
				});
			}
		} catch (error) {
			console.error("Error sending message:", error);
			setMessages((prev) => prev.slice(0, -1));
			toast({
				title: "Error",
				description:
					mode === "local"
						? "Failed to generate response with local model. Please try reinitializing the model."
						: "Failed to send message. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleModelSelect = async (modelId: string) => {
		try {
			setSelectedModel(modelId);

			if (mode === "local") {
				setIsInitializing(true);
				try {
					const service = WebLLMService.getInstance();
					await service.init(modelId, (report) => {
						setInitProgress(
							`Loading model... ${(report.progress * 100).toFixed(2)}%`,
						);
					});
					setWebLLM(service);
				} catch (error) {
					console.error("Error initializing local model:", error);
					toast({
						title: "Error",
						description: "Failed to initialize local model. Please try again.",
						variant: "destructive",
					});
					setSelectedModel(defaultModel);
				} finally {
					setIsInitializing(false);
				}
			} else {
				const modelExists = models.find((m) => m.id === modelId);
				if (!modelExists) {
					toast({
						title: "Error",
						description: "Invalid model selected.",
						variant: "destructive",
					});
					setSelectedModel(defaultModel);
					return;
				}
			}
		} catch (error) {
			console.error("Error selecting model:", error);
			toast({
				title: "Error",
				description: "Failed to select model. Please try again.",
				variant: "destructive",
			});
			setSelectedModel(defaultModel);
		}
	};

	const isMobileSidebarOpen = !isDesktop && isSidebarOpen;

	return (
		<div className="flex-1 flex flex-col w-full">
			{/* Mobile Header */}
			{!isDesktop && (
				<div className="p-4 border-b">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					>
						<Menu className="h-6 w-6" />
						<span className="sr-only">Toggle sidebar</span>
					</Button>
				</div>
			)}

			{/* Messages Area */}
			<ScrollArea className={`flex-1 p-4 ${isMobileSidebarOpen ? "blur" : ""}`}>
				<MessageList
					messages={messages}
					isLoading={isLoading}
					hasErrored={hasErrored}
					selectedChat={selectedChat}
					onReaction={onReaction}
				/>
				<div ref={messagesEndRef} />
			</ScrollArea>

			{/* Input Area */}
			<div className={isMobileSidebarOpen ? "blur" : ""}>
				{!messages.length && !hasErrored && (
					<Suggestions
						suggestions={suggestions}
						onSelect={handleSendMessage}
						isDisabled={isLoading || isInitializing || isMobileSidebarOpen}
					/>
				)}

				{!hasErrored && (
					<div className="p-4 border-t">
						<div className="flex items-center gap-4 mb-4">
							<div className="shrink-0">
								<ModeSelector
									mode={mode}
									onChange={setMode}
									isDisabled={isLoading || isMobileSidebarOpen}
								/>
							</div>

							<div className="w-full">
								<ModelSelector
									selectedModel={selectedModel}
									onModelSelect={handleModelSelect}
									models={mode === "local" ? localModels : remoteModels}
									isDisabled={isLoading || isMobileSidebarOpen}
									mode={mode}
									isInitializing={isInitializing}
									initProgress={initProgress}
								/>
							</div>
						</div>

						<ChatInput
							onSendMessage={handleSendMessage}
							onTranscribe={onTranscribe}
							isLoading={isLoading}
							isDisabled={isMobileSidebarOpen || isInitializing}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
