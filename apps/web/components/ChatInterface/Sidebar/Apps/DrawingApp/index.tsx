import { useState } from 'react';
import { PencilIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { onGenerateDrawing } from '@/components/ChatInterface/actions';
import { DrawingCanvas } from './DrawingCanvas';

export function SidebarDrawingApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (drawingData: string): Promise<any> => {
    try {
      const data = await onGenerateDrawing(drawingData);
      setResult(data as string);
      return data as any;
    } catch (error) {
      console.error('Error submitting drawing:', error);
      throw error;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={() => setIsOpen(true)}
        >
          <PencilIcon className="h-4 w-4" />
          <span className="sr-only">Drawing</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate a Drawing</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DrawingCanvas onSubmit={handleSubmit} result={result} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
