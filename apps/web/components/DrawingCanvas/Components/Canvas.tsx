import { useState } from 'react';

import { floodFill } from '../utils';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isFillMode: boolean;
  currentColor: string;
  lineWidth: number;
  saveToHistory: () => void;
  onDrawingComplete?: () => void;
}

export function Canvas({
  canvasRef,
  isFillMode,
  currentColor,
  lineWidth,
  saveToHistory,
  onDrawingComplete,
}: CanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (isFillMode) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      floodFill(imageData, Math.round(x), Math.round(y), currentColor);
      ctx.putImageData(imageData, 0, 0);
      saveToHistory();
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

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastX(x);
    setLastY(y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    saveToHistory();
    onDrawingComplete?.();
  };

  return (
    <div className="relative w-full aspect-square">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="absolute top-0 left-0 w-full h-full border border-gray-200 rounded-lg cursor-crosshair bg-[#f9fafb] shadow-sm"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
