import { useState, useRef, useEffect } from 'react';
import { GameState } from '../types';
import { GAME_WORDS, GAME_DURATION } from '../constants';

export function useGameState(
  onGuess?: (drawingData: string) => Promise<any>,
  clearCanvas?: () => void
) {
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    targetWord: '',
    timeRemaining: GAME_DURATION,
    guesses: [],
    hasWon: false,
  });

  const timerRef = useRef<NodeJS.Timeout>();
  const guessTimeoutRef = useRef<NodeJS.Timeout>();

  const startGame = () => {
    const randomWord =
      GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
    if (!randomWord) return;

    clearCanvas?.();

    setGameState({
      isActive: true,
      targetWord: randomWord,
      timeRemaining: GAME_DURATION,
      guesses: [],
      hasWon: false,
      statusMessage: undefined,
    });
  };

  const endGame = () => {
    setGameState((prev) => ({ ...prev, isActive: false }));
    if (timerRef.current) clearInterval(timerRef.current);
    if (guessTimeoutRef.current) clearTimeout(guessTimeoutRef.current);
  };

  const handleGuess = async (drawingData: string) => {
    if (!gameState.isActive || !onGuess) return;

    try {
      const response = await onGuess(drawingData);
      const guess = response?.response?.content?.toLowerCase() || '';

      setGameState((prev) => {
        const newGuesses = [...prev.guesses, { guess, timestamp: Date.now() }];

        const hasWon = guess.includes(prev.targetWord.toLowerCase());
        if (hasWon) {
          const timeSpent = GAME_DURATION - prev.timeRemaining;
          endGame();
          return {
            ...prev,
            guesses: newGuesses,
            hasWon,
            statusMessage: {
              type: 'success',
              message: `Congratulations! The AI guessed "${prev.targetWord}" in ${timeSpent} seconds!`,
            },
          };
        }

        return { ...prev, guesses: newGuesses, hasWon };
      });
    } catch (error) {
      console.error('Error getting AI guess:', error);
    }
  };

  useEffect(() => {
    if (gameState.isActive && gameState.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining <= 1) {
            endGame();
            return {
              ...prev,
              timeRemaining: 0,
              statusMessage: {
                type: 'failure',
                message: `Time's up! The word was "${prev.targetWord}". Better luck next time!`,
              },
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.isActive]);

  return {
    gameState,
    startGame,
    endGame,
    handleGuess,
  };
}
