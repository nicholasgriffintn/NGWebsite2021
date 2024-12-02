import { GameState } from '../types';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameStatusProps {
  gameState: GameState;
  onStartGame: () => void;
  onEndGame: () => void;
  isConnected: boolean;
}

export function GameStatus({
  gameState,
  onStartGame,
  onEndGame,
  isConnected,
}: GameStatusProps) {
  const getStatusBackground = (timeRemaining: number, hasWon: boolean) => {
    if (hasWon) return 'bg-green-100 dark:bg-green-900';
    if (timeRemaining <= 30) return 'bg-red-100 dark:bg-red-900';
    if (timeRemaining <= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-blue-100 dark:bg-blue-900';
  };

  if (!gameState.isActive) {
    return (
      <div className="p-4 space-y-4">
        {gameState.statusMessage && (
          <div
            className={`p-4 rounded-lg mb-4 text-sm font-medium ${
              gameState.statusMessage.type === 'success'
                ? 'bg-green-100 dark:bg-green-900'
                : 'bg-red-100 dark:bg-red-900'
            }`}
          >
            {gameState.statusMessage.message}
          </div>
        )}
        <div className="prose dark:prose-invert mb-4">
          <h3 className="text-lg font-medium mb-2">Drawing Game</h3>
          <p className="text-sm text-muted-foreground">
            Test your drawing skills! You'll be given a word to draw and have 2
            minutes to get the AI to guess it correctly.
          </p>
          <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
            <li>You'll get a random word to draw</li>
            <li>AI will try to guess every few seconds</li>
            <li>Game ends when AI guesses correctly or time runs out</li>
          </ul>
        </div>
        {!isConnected ? (
          <p className="text-sm text-muted-foreground">
            Connecting to game server...
          </p>
        ) : (
          <Button onClick={onStartGame} className="w-full">
            Start Game
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg transition-colors ${getStatusBackground(
        gameState.timeRemaining,
        gameState.hasWon
      )}`}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Draw:</span>
            <Timer className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold">{gameState.targetWord}</span>
          <div className="flex flex-col">
            <span className="text-xs">Time Remaining:</span>
            <span className="text-2xl font-bold">
              {Math.floor(gameState.timeRemaining / 60)}:
              {(gameState.timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <Button onClick={onEndGame} variant="outline" className="w-full">
          End Game
        </Button>
      </div>
    </div>
  );
}
