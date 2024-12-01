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
      paintingUrl: {
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
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<DrawingResponse | null>(null);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#030712';
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.quadraticCurveTo(lastX, lastY, x, y);
    ctx.stroke();

    setLastX(x);
    setLastY(y);
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {apiResult?.response?.content && (
        <p className="text-sm text-muted-foreground">
          {apiResult.response.content}
        </p>
      )}
      <div className="flex flex-col lg:flex-row gap-6">
        {!result && (
          <div className="flex-1 space-y-4">
            <div className="relative w-full aspect-square max-w-2xl mx-auto">
              <canvas
                ref={canvasRef}
                width={800}
                height={800}
                className="absolute top-0 left-0 w-full h-full border border-gray-200 rounded-lg cursor-crosshair bg-[#f9fafb]"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <div className="flex gap-4 max-w-2xl mx-auto">
              <Button
                onClick={clearCanvas}
                variant="outline"
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
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
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {apiResult?.response?.data?.drawingUrl?.key && (
              <div className="space-y-3 w-full">
                <h3 className="text-lg font-medium">Your Drawing</h3>
                <img
                  src={getImageUrl(apiResult.response.data.drawingUrl.key)}
                  alt="Your drawing"
                  className="w-full aspect-square object-cover rounded-lg border border-gray-200 bg-[#f9fafb]"
                />
              </div>
            )}
            {apiResult?.response?.data?.paintingUrl?.key && (
              <div className="space-y-3 w-full">
                <h3 className="text-lg font-medium">AI Generated Painting</h3>
                <img
                  src={getImageUrl(apiResult.response.data.paintingUrl.key)}
                  alt="AI generated painting"
                  className="w-full aspect-square object-cover rounded-lg border border-gray-200 bg-[#f9fafb]"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
