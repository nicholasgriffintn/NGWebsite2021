import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

interface ModeSelectorProps {
  mode: 'remote' | 'local';
  onChange: (mode: 'remote' | 'local') => void;
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
      onValueChange={(value: 'remote' | 'local') => onChange(value)}
      disabled={isDisabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="remote">Remote (Cloud)</SelectItem>
        <SelectItem value="local">Local (WebLLM)</SelectItem>
      </SelectContent>
    </Select>
  );
}
