import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, User } from '../types';
import { GAME_DURATION } from '../constants';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:8786'
    : 'wss://website-multiplayer.nickgriffin.uk';

export function useGameState(
  gameId: string,
  playerId: string,
  playerName: string,
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
  const [users, setUsers] = useState<Array<User>>([]);
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

        switch (data.type) {
          case 'gameState':
            setGameState(data.gameState);
            setUsers(data.users);
            break;
          case 'gameStarted':
            clearCanvas?.();
            break;
          case 'gameEnded':
            setGameState(data.gameState);
            setUsers(data.users);
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

  const updateDrawing = useCallback(
    async (drawingData: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        return;
      }

      wsRef.current.send(
        JSON.stringify({
          action: 'updateDrawing',
          drawingData,
        })
      );
    },
    [gameState.isActive, playerId]
  );

  return {
    isConnected,
    gameState,
    users,
    startGame,
    endGame,
    updateDrawing,
  };
}
