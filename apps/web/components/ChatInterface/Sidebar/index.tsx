import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarApps } from "@/components/ChatInterface/Sidebar/Apps";

export function ChatSidebar({
	handleNewChat,
	chatKeys,
	handleChatSelect,
	selectedChat,
}) {
	return (
		<div className="w-64 border-r bg-muted/20 flex flex-col h-full">
			<div className="py-4 space-y-2 h-full">
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
										? "bg-primary text-primary-foreground"
										: "hover:bg-muted"
								}`}
							>
								{chat.title}
							</button>
						))}
					</div>
				</ScrollArea>
				<SidebarApps />
			</div>
		</div>
	);
}
