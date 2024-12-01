import { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface DrawingResponse {
  response: {
    status: string;
    content: string;
    data: {
      drawingUrl: {
        key: string;
      };
      imageUrl: {
        key: string;
      };
    };
  };
}

interface DrawingCanvasProps {
  onSubmit: (drawingData: string) => Promise<any>;
  result: string | null;
}

export function DrawingCanvas({ onSubmit, result }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<DrawingResponse | null>(null);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.moveTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const drawingData = canvas.toDataURL('image/png');
      const response = await onSubmit(drawingData);
      setApiResult(response);
    } catch (error) {
      console.error('Error submitting drawing:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (key: string) => {
    return `https://assistant-assets.nickgriffin.uk/${key}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {!result && (
        <div className="flex-1 space-y-4">
          <div className="relative w-full aspect-square">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="absolute top-0 left-0 w-full h-full border border-gray-200 rounded-lg cursor-crosshair bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Submit Drawing'
            )}
          </Button>
        </div>
      )}

      {result && (
        <div className="flex-1 space-y-4">
          <div className="space-y-4">
            {apiResult?.response.data.drawingUrl.key && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Your Drawing</h3>
                <img
                  src={getImageUrl(apiResult.response.data.drawingUrl.key)}
                  alt="Your drawing"
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
            )}
            {apiResult?.response.data.imageUrl.key && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">AI Generated Painting</h3>
                <img
                  src={getImageUrl(apiResult.response.data.imageUrl.key)}
                  alt="AI generated painting"
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {apiResult?.response.content}
          </p>
        </div>
      )}
    </div>
  );
}
