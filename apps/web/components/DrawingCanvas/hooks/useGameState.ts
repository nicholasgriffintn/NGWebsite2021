import { useState, useEffect } from 'react';
import { GameState, GameStateResponse } from '../types';
import { GAME_DURATION } from '../constants';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8786/anyone-can-draw'
    : 'https://website-multiplayer.nickgriffin.uk/anyone-can-draw';

export function useGameState(
  gameId: string,
  playerId: string,
  playerName: string,
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

  useEffect(() => {
    fetch(`${BASE_URL}/users?gameId=${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerId, playerName }),
    });

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${BASE_URL}/game?gameId=${gameId}`);
        const data = (await response.json()) as GameStateResponse;
        if (data.success) {
          setGameState(data.gameState);
        }
      } catch (error) {
        console.error('Error polling game state:', error);
      }
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      fetch(`${BASE_URL}/users?gameId=${gameId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });
    };
  }, [gameId, playerId]);

  const startGame = async () => {
    try {
      if (!gameId) return;
      const response = await fetch(`${BASE_URL}/game?gameId=${gameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'startGame',
          playerId,
        }),
      });
      const data = (await response.json()) as GameStateResponse;
      if (data.success) {
        clearCanvas?.();
        setGameState(data.gameState);
      }
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const endGame = async () => {
    try {
      if (!gameId) return;
      const response = await fetch(`${BASE_URL}/game?gameId=${gameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'endGame',
          playerId,
        }),
      });
      const data = (await response.json()) as GameStateResponse;
      if (data.success) {
        setGameState(data.gameState);
      }
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const handleGuess = async (drawingData: string) => {
    if (!gameState.isActive || !onGuess) return;

    try {
      await fetch(`${BASE_URL}/game?gameId=${gameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateDrawing',
          drawingData,
        }),
      });

      const response = await onGuess(drawingData);
      const guess = response?.response?.content?.toLowerCase() || '';

      await fetch(`${BASE_URL}/game?gameId=${gameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submitGuess',
          playerId,
          guess,
        }),
      });
    } catch (error) {
      console.error('Error handling guess:', error);
    }
  };

  return {
    gameState,
    startGame,
    endGame,
    handleGuess,
  };
}
