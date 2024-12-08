import {
	Select,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import type { ChatMode } from "@/types/chat";
interface ModeSelectorProps {
	mode: ChatMode;
	onChange: (mode: ChatMode) => void;
	isDisabled: boolean;
}

export function ModeSelector({
	mode,
	onChange,
	isDisabled,
}: ModeSelectorProps) {
	return (
		<Select
			value={mode}
			onValueChange={(value: ChatMode) => onChange(value)}
			disabled={isDisabled}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select mode" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="remote">Remote (Cloud)</SelectItem>
				<SelectItem value="local">Local (WebLLM)</SelectItem>
				<SelectItem value="prompt_coach">Prompt Coach</SelectItem>
			</SelectContent>
		</Select>
	);
}
