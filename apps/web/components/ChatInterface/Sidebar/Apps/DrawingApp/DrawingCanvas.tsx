import { useRef, useState, useEffect } from 'react';
import { Loader2, Undo2, Redo2 } from 'lucide-react';

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

const COLORS = [
  // Grayscale
  '#030712', // Black
  '#4b5563', // Gray
  '#f9fafb', // White
  // Primary colors
  '#ef4444', // Red
  '#f59e0b', // Orange
  '#fbbf24', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  // Pastel colors
  '#fecaca', // Light Red
  '#fed7aa', // Light Orange
  '#fef08a', // Light Yellow
  '#bbf7d0', // Light Green
  '#bfdbfe', // Light Blue
  '#c7d2fe', // Light Indigo
  '#e9d5ff', // Light Purple
  // Additional colors
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#8b5cf6', // Violet
];

const LINE_WIDTHS = [2, 4, 6, 8, 12, 16];

export function DrawingCanvas({ onSubmit, result }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<DrawingResponse | null>(null);
  const [currentColor, setCurrentColor] = useState('#030712');
  const [lineWidth, setLineWidth] = useState(3);
  const [isFillMode, setIsFillMode] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (isFillMode) {
      // Fill the canvas with selected color
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      floodFill(imageData, Math.round(x), Math.round(y), currentColor);
      ctx.putImageData(imageData, 0, 0);
      return;
    }

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;
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
    if (isDrawing) {
      saveToHistory();
    }
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
    saveToHistory();
  };

  const floodFill = (
    imageData: ImageData,
    startX: number,
    startY: number,
    fillColor: string
  ) => {
    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Convert hex to RGB
    const fillRGB = hexToRgb(fillColor);
    if (!fillRGB) return;

    const startPos = (startY * width + startX) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];

    if (startR === fillRGB.r && startG === fillRGB.g && startB === fillRGB.b) {
      return;
    }

    const stack = [[startX, startY]];

    while (stack.length) {
      const [x, y] = stack.pop()!;
      const pos = (y * width + x) * 4;

      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (
        pixels[pos] !== startR ||
        pixels[pos + 1] !== startG ||
        pixels[pos + 2] !== startB
      )
        continue;

      pixels[pos] = fillRGB.r;
      pixels[pos + 1] = fillRGB.g;
      pixels[pos + 2] = fillRGB.b;
      pixels[pos + 3] = 255;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex <= 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Save initial blank state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
    setHistoryIndex(0);
  };

  useEffect(() => {
    initCanvas();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4">
      {apiResult?.response?.content && (
        <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
          {apiResult.response.content}
        </p>
      )}
      <div className="flex flex-col lg:flex-row gap-6">
        {!result && (
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Tools Panel - Now on the left */}
            <div className="lg:w-64 flex flex-col gap-4">
              <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Drawing Tools</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className="h-8 w-8"
                      title="Undo"
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className="h-8 w-8"
                      title="Redo"
                    >
                      <Redo2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tool Selection */}
                <div className="flex gap-2">
                  <Button
                    variant={!isFillMode ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setIsFillMode(false)}
                    className="flex-1"
                  >
                    Brush
                  </Button>
                  <Button
                    variant={isFillMode ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setIsFillMode(true)}
                    className="flex-1"
                  >
                    Fill
                  </Button>
                </div>

                {/* Improved Line Width Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Line Width</label>
                    <span className="text-sm text-muted-foreground">
                      {lineWidth}px
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {LINE_WIDTHS.map((width) => (
                      <button
                        key={width}
                        onClick={() => setLineWidth(width)}
                        className={`
                          p-2 h-12 rounded-md flex items-center justify-center
                          transition-all duration-200
                          ${
                            lineWidth === width
                              ? 'bg-primary/10 border-2 border-primary shadow-sm scale-105'
                              : 'border border-muted hover:border-primary/50 hover:bg-muted'
                          }
                        `}
                        title={`${width}px`}
                      >
                        <div className="w-full flex items-center justify-center">
                          <div
                            className="rounded-full bg-foreground"
                            style={{
                              width: `${width}px`,
                              height: `${width}px`,
                            }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Line Preview */}
                <div className="p-3 border rounded-md bg-background">
                  <div className="w-full h-[2px] bg-muted" />
                  <div
                    className="w-full rounded-full bg-foreground transition-all duration-200"
                    style={{
                      height: `${lineWidth}px`,
                      marginTop: '8px',
                    }}
                  />
                </div>

                {/* Existing Color Picker */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-10 h-10 rounded-md cursor-pointer border-0"
                    title="Custom Color"
                  />
                  <span className="text-sm text-muted-foreground">
                    Custom Color
                  </span>
                </div>

                {/* Existing Color Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className="aspect-square rounded-md transition-all hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: color,
                        outline:
                          color === currentColor ? '2px solid #3b82f6' : 'none',
                        outlineOffset: '2px',
                        transform:
                          color === currentColor ? 'scale(1.1)' : 'scale(1)',
                      }}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>

                <Button
                  onClick={clearCanvas}
                  variant="outline"
                  size="sm"
                  className="w-full text-muted-foreground"
                >
                  Clear Canvas
                </Button>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
                size="lg"
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

            {/* Main Drawing Area */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="relative w-full aspect-square">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={800}
                  className="absolute top-0 left-0 w-full h-full border border-gray-200 rounded-lg cursor-crosshair bg-[#f9fafb] shadow-sm"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {apiResult?.response?.data?.drawingUrl?.key && (
              <div className="space-y-3 w-full">
                <h3 className="text-lg font-medium">Your Drawing</h3>
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                  <img
                    src={getImageUrl(apiResult.response.data.drawingUrl.key)}
                    alt="Your drawing"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            {apiResult?.response?.data?.paintingUrl?.key && (
              <div className="space-y-3 w-full">
                <h3 className="text-lg font-medium">AI Generated Painting</h3>
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                  <img
                    src={getImageUrl(apiResult.response.data.paintingUrl.key)}
                    alt="AI generated painting"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
