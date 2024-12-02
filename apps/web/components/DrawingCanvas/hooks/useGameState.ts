import { useState, useEffect } from 'react';
import { GameState, GameStateResponse } from '../types';
import { GAME_DURATION } from '../constants';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8786'
    : 'https://website-multiplayer.nickgriffin.uk';

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
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/status`);
        const data = (await response.json()) as { status: string };
        if (data.status === 'ok') {
          setIsApiReady(true);
        } else {
          setTimeout(checkApiStatus, 5000);
        }
      } catch (error) {
        console.error('Error checking API status:', error);
        setTimeout(checkApiStatus, 5000);
      }
    };

    checkApiStatus();
  }, []);

  useEffect(() => {
    if (!isApiReady) return;

    fetch(`${BASE_URL}/anyone-can-draw/users?gameId=${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerId, playerName }),
    });

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/anyone-can-draw/game?gameId=${gameId}`
        );
        const data = (await response.json()) as GameStateResponse;
        if (data.ok) {
          setGameState(data.gameState);
        }
      } catch (error) {
        console.error('Error polling game state:', error);
      }
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      fetch(`${BASE_URL}/anyone-can-draw/users?gameId=${gameId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });
    };
  }, [gameId, playerId, isApiReady]);

  const startGame = async () => {
    try {
      if (!gameId) return;
      const response = await fetch(
        `${BASE_URL}/anyone-can-draw/game?gameId=${gameId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'startGame',
            playerId,
          }),
        }
      );
      const data = (await response.json()) as GameStateResponse;
      if (data.ok) {
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
      const response = await fetch(
        `${BASE_URL}/anyone-can-draw/game?gameId=${gameId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'endGame',
            playerId,
          }),
        }
      );
      const data = (await response.json()) as GameStateResponse;
      if (data.ok) {
        setGameState(data.gameState);
      }
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const handleGuess = async (drawingData: string) => {
    if (!gameState.isActive || !onGuess) return;

    try {
      await fetch(`${BASE_URL}/anyone-can-draw/game?gameId=${gameId}`, {
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

      await fetch(`${BASE_URL}/anyone-can-draw/game?gameId=${gameId}`, {
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
    isApiReady,
    gameState,
    startGame,
    endGame,
    handleGuess,
  };
}
