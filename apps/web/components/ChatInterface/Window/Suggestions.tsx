import { Button } from '@/components/ui/button';

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
    <div className="px-4 py-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          className="text-sm"
          onClick={() => onSelect(suggestion)}
          disabled={isDisabled}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
