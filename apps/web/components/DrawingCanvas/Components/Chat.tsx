import { GameState } from '../types';

export default function Chat({
  gameState,
  onGuess,
  isDrawer,
}: {
  gameState: GameState;
  onGuess?: (guess: string) => Promise<any>;
  isDrawer: boolean;
}) {
  const handleGuess = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const guess = formData.get('guess') as string;
    await onGuess?.(guess);
  };

  return (
    <div className="bg-muted p-4 rounded-lg flex-1">
      <h3 className="font-medium mb-2">Game Guesses:</h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {gameState.guesses.map((guess, index) => (
          <div
            key={index}
            className={`text-sm p-2 rounded ${
              guess.correct ? 'bg-green-100 dark:bg-green-900' : 'bg-background'
            }`}
          >
            <span className="font-medium">{guess.playerName}:</span>{' '}
            {guess.guess}
          </div>
        ))}
        {!isDrawer && <span>TODO: Put a form here to guess</span>}
      </div>
    </div>
  );
}
