import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../types';
import { GAME_DURATION } from '../constants';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:8786'
    : 'wss://website-multiplayer.nickgriffin.uk';

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
    currentDrawer: undefined,
    endTime: undefined,
    statusMessage: undefined,
    drawingData: undefined,
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${BASE_URL}/anyone-can-draw?gameId=${gameId}`);
    wsRef.current = ws;

    console.log(ws);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Joining game');
      ws.send(
        JSON.stringify({
          action: 'join',
          playerId,
          playerName,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.gameState) {
          setGameState(data.gameState);
          return;
        }

        switch (data.type) {
          case 'gameState':
            setGameState(data.gameState);
            break;
          case 'gameStarted':
            clearCanvas?.();
            setGameState(data.gameState);
            break;
          case 'gameEnded':
            setGameState(data.gameState);
            break;
          case 'error':
            console.error('Game error:', data.message);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket closed');
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          wsRef.current = null;
        }
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            action: 'leave',
            playerId,
          })
        );
        ws.close();
      }
    };
  }, [gameId, playerId, playerName]);

  const startGame = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    wsRef.current.send(
      JSON.stringify({
        action: 'startGame',
        playerId,
      })
    );
  }, [playerId]);

  const endGame = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    wsRef.current.send(
      JSON.stringify({
        action: 'leave',
        playerId,
      })
    );
  }, [playerId]);

  const handleGuess = useCallback(
    async (drawingData: string) => {
      if (
        !gameState.isActive ||
        !onGuess ||
        !wsRef.current ||
        wsRef.current.readyState !== WebSocket.OPEN
      ) {
        return;
      }

      try {
        wsRef.current.send(
          JSON.stringify({
            action: 'updateDrawing',
            drawingData,
          })
        );

        const response = await onGuess(drawingData);
        const guess = response?.response?.content?.toLowerCase() || '';

        wsRef.current.send(
          JSON.stringify({
            action: 'submitGuess',
            playerId,
            guess,
          })
        );
      } catch (error) {
        console.error('Error handling guess:', error);
      }
    },
    [gameState.isActive, onGuess, playerId]
  );

  return {
    isConnected,
    gameState,
    startGame,
    endGame,
    handleGuess,
  };
}
