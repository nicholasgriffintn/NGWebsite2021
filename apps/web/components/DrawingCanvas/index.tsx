'use client';

import { useRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { DrawingResponse, DrawingCanvasProps } from './types';
import { ColorPicker } from './Components/ColorPicker';
import { LineWidthPicker } from './Components/LineWidthPicker';
import { ToolPicker } from './Components/ToolPicker';
import { Header } from './Components/Header';
import { Result } from './Components/Result';
import { Canvas } from './Components/Canvas';
import { useGameState } from './hooks/useGameState';
import { GameStatus } from './Components/GameStatus';

export function DrawingCanvas({
  onSubmit,
  onGuess,
  result,
  gameMode,
  gameId,
  playerId,
  playerName,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<DrawingResponse | null>(null);
  const [currentColor, setCurrentColor] = useState('#030712');
  const [lineWidth, setLineWidth] = useState(3);
  const [isFillMode, setIsFillMode] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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
    const imageData = history[newIndex];
    if (!imageData) return;

    ctx.putImageData(imageData, 0, 0);
    setHistoryIndex(newIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const newIndex = historyIndex + 1;
    const imageData = history[newIndex];
    if (!imageData) return;

    ctx.putImageData(imageData, 0, 0);
    setHistoryIndex(newIndex);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
    setHistoryIndex(0);
  };

  useEffect(() => {
    initCanvas();
  }, []);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [historyIndex, history]);

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

  const { isApiReady, gameState, startGame, endGame, handleGuess } =
    useGameState(gameId, playerId, playerName, onGuess, clearCanvas);

  const handleDrawingComplete = async () => {
    if (gameState.isActive && canvasRef.current) {
      const drawingData = canvasRef.current.toDataURL('image/png');
      await handleGuess(drawingData);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {!result && (
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="lg:w-64 flex flex-col gap-4">
              <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border shadow-sm">
                <Header
                  undo={undo}
                  redo={redo}
                  history={history}
                  historyIndex={historyIndex}
                />

                <ToolPicker
                  isFillMode={isFillMode}
                  setIsFillMode={setIsFillMode}
                />

                <LineWidthPicker
                  lineWidth={lineWidth}
                  setLineWidth={setLineWidth}
                />

                <ColorPicker
                  currentColor={currentColor}
                  setCurrentColor={setCurrentColor}
                />

                <Button
                  onClick={clearCanvas}
                  variant="outline"
                  size="sm"
                  className="w-full text-muted-foreground"
                >
                  Clear Canvas
                </Button>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <Canvas
                canvasRef={canvasRef}
                isFillMode={isFillMode}
                currentColor={currentColor}
                lineWidth={lineWidth}
                saveToHistory={saveToHistory}
                onDrawingComplete={handleDrawingComplete}
              />
            </div>

            <div className="lg:w-80 flex flex-col gap-4">
              {!gameState.isActive && (
                <div className="bg-card p-4 rounded-lg border shadow-sm">
                  <div className="prose dark:prose-invert mb-4">
                    <h3 className="text-lg font-medium">Generate AI Art</h3>
                    <p className="text-sm text-muted-foreground">
                      Draw anything you like and get an AI-generated painting
                      based on your drawing.
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || gameState.isActive}
                    className="w-full"
                    size="lg"
                    variant="default"
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
              )}

              {gameMode && (
                <>
                  <div className="bg-card rounded-lg border shadow-sm">
                    <GameStatus
                      gameState={gameState}
                      onStartGame={startGame}
                      onEndGame={endGame}
                      isApiReady={isApiReady}
                    />
                  </div>

                  {gameState.isActive && (
                    <div className="bg-muted p-4 rounded-lg flex-1">
                      <h3 className="font-medium mb-2">AI Guesses:</h3>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {gameState.guesses.map((guess, index) => (
                          <div
                            key={index}
                            className={`text-sm p-2 rounded ${
                              guess.guess.includes(
                                gameState.targetWord.toLowerCase()
                              )
                                ? 'bg-green-100 dark:bg-green-900'
                                : 'bg-background'
                            }`}
                          >
                            {new Date(guess.timestamp).toLocaleTimeString()}:{' '}
                            {guess.guess}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {result && <Result apiResult={apiResult} />}
      </div>
    </div>
  );
}
