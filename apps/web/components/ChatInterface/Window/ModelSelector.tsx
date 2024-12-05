import { Info, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { ChatMode } from '@/types/chat';
interface Model {
  id: string;
  name: string;
  description?: string;
  contextLength?: number;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => Promise<void>;
  models: Model[];
  isDisabled: boolean;
  mode: ChatMode;
  isInitializing?: boolean;
  initProgress?: string;
}

export function ModelSelector({
  selectedModel,
  onModelSelect,
  models,
  isDisabled,
  mode,
  isInitializing = false,
  initProgress = '',
}: ModelSelectorProps) {
  const selectedModelInfo = models.find((m) => m.id === selectedModel);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedModel}
        onValueChange={onModelSelect}
        disabled={isDisabled || isInitializing}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a model">
            {isInitializing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  {selectedModelInfo?.name}: {initProgress}
                </span>
              </div>
            ) : (
              selectedModelInfo?.name || 'Select a model'
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedModelInfo &&
        (selectedModelInfo.description || selectedModelInfo.contextLength) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isDisabled}
              >
                <Info className="h-4 w-4" />
                <span className="sr-only">Model information</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  {selectedModelInfo.name}
                </h4>
                {selectedModelInfo.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedModelInfo.description}
                  </p>
                )}
                {selectedModelInfo.contextLength && (
                  <p className="text-sm text-muted-foreground">
                    Context length:{' '}
                    {selectedModelInfo.contextLength.toLocaleString()} tokens
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Mode: {mode === 'local' ? 'Running locally' : 'Cloud-based'}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        )}
    </div>
  );
}
