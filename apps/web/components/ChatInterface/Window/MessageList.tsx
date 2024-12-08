import type { ChatMessage } from "@/types/chat";
import { formatDate } from "@/lib/dates";
import { LoadingState } from "./states/LoadingState";
import { ErrorState } from "./states/ErrorState";
import { EmptyState } from "./states/EmptyState";
import { MessageListItem } from "./MessageListItem";

interface MessageListProps {
	messages: ChatMessage[];
	isLoading: boolean;
	hasErrored: boolean;
	selectedChat: string | null;
	onReaction: (
		messageId: string,
		content: string,
		logId: string,
		reaction: string,
	) => Promise<void>;
}

export function MessageList({
	messages,
	isLoading,
	hasErrored,
	selectedChat,
	onReaction,
}: MessageListProps) {
	let lastDate = null;

	if (isLoading && !messages.length) {
		return <LoadingState selectedChat={selectedChat} />;
	}

	if (hasErrored) {
		return <ErrorState />;
	}

	if (!messages.length) {
		return <EmptyState />;
	}

	return messages.map((message) => {
		const messageDate = message.timestamp
			? new Date(message.timestamp)
			: undefined;
		const showDate = messageDate && lastDate !== formatDate(messageDate);
		lastDate = messageDate && formatDate(messageDate);

		const handleReaction = (reaction: string) => {
			const content =
				typeof message.content === "string"
					? message.content
					: message?.content?.prompt || "";
			return onReaction(message.id, content, message.logId || "", reaction);
		};

		return (
			<MessageListItem
				key={message.id}
				message={message}
				showDate={showDate || false}
				messageDate={messageDate}
				onReaction={handleReaction}
			/>
		);
	});
}
