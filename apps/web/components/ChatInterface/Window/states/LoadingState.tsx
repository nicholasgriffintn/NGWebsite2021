interface LoadingStateProps {
	selectedChat: string | null;
}

export function LoadingState({ selectedChat }: LoadingStateProps) {
	return (
		<div className="flex items-center justify-center h-full">
			<p>Loading messages{selectedChat ? " for this chat" : ""}...</p>
		</div>
	);
}
