'use client';

import { useState } from 'react';

import { DrawingCanvas } from '@/components/DrawingCanvas';
import { onGenerateDrawing } from '@/components/ChatInterface/actions';

export function AnyoneCanDraw() {
  const [result, setResult] = useState<string | null>(null);
  // TODO: make this dynamic
  const gameId = 'everyone';
  // TODO: make this dynamic
  const playerId = 'anonymous';
  const playerName = 'Anonymous';

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
    <DrawingCanvas
      onSubmit={handleSubmit}
      result={result}
      gameMode={true}
      gameId={gameId}
      playerId={playerId}
      playerName={playerName}
    />
  );
}
