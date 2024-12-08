import { Button } from "@/components/ui/button";

interface SuggestionsProps {
	suggestions: string[];
	onSelect: (suggestion: string) => void;
	isDisabled: boolean;
}

export function Suggestions({
	suggestions,
	onSelect,
	isDisabled,
}: SuggestionsProps) {
	return (
		<div className="px-4 py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
			{suggestions.map((suggestion) => (
				<Button
					key={suggestion}
					variant="outline"
					className="text-sm w-full truncate hover:bg-primary hover:text-primary-foreground transition-colors"
					onClick={() => onSelect(suggestion)}
					disabled={isDisabled}
				>
					{suggestion}
				</Button>
			))}
		</div>
	);
}
