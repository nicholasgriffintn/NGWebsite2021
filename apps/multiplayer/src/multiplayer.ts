import {
  GameState,
  JoinRequest,
  StartGameRequest,
  GuessRequest,
  DrawingUpdateRequest,
} from './types';
import { GAME_WORDS } from './constants';
import { DurableObject, DurableObjectState } from '@cloudflare/workers-types';

export class Multiplayer implements DurableObject {
  private state: DurableObjectState;
  private users: Map<string, { name: string; score: number }>;
  private gameState: GameState;
  private GAME_DURATION = 120;
  private timerInterval: number | null = null;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.users = new Map();
    this.gameState = {
      isActive: false,
      targetWord: '',
      timeRemaining: this.GAME_DURATION,
      guesses: [],
      hasWon: false,
    };

    this.state.blockConcurrencyWhile(async () => {
      const [storedUsers, storedGame] = await Promise.all([
        this.state.storage.get('users'),
        this.state.storage.get('gameState'),
      ]);

      // @ts-ignore
      if (storedUsers) this.users = storedUsers;
      // @ts-ignore
      if (storedGame) this.gameState = storedGame;
    });
  }

  async fetch(request: Request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    this.state.acceptWebSocket(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    try {
      const data = JSON.parse(message);

      switch (data.action) {
        case 'join':
          await this.handleJoin(data);
          break;
        case 'leave':
          await this.handleLeave(data);
          break;
        case 'startGame':
          await this.handleStartGame(data);
          break;
        case 'submitGuess':
          await this.handleGuess(data);
          break;
        case 'updateDrawing':
          await this.handleDrawingUpdate(data);
          break;
      }

      this.broadcast({
        type: 'gameState',
        gameState: this.gameState,
        users: Array.from(this.users.entries()).map(([id, data]) => ({
          id,
          ...data,
        })),
      });
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(
        JSON.stringify({
          type: 'error',
          error: 'Invalid message format',
        })
      );
    }
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string) {
    try {
      ws.close(code, reason || 'Durable Object is closing WebSocket');
    } catch (error) {
      console.error('Error closing WebSocket:', error);
    }
  }

  private async handleJoin({ playerId, playerName }: JoinRequest) {
    try {
      if (!this.users.has(playerId)) {
        this.users.set(playerId, { name: playerName, score: 0 });
        await this.state.storage.put('users', this.users);

        this.broadcast({
          type: 'playerJoined',
          playerId,
          playerName,
        });
      }
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  }

  private async handleLeave({ playerId }: { playerId: string }) {
    try {
      this.users.delete(playerId);
      await this.state.storage.put('users', this.users);
      this.broadcast({
        type: 'playerLeft',
        playerId,
      });

      if (
        this.gameState.isActive &&
        this.gameState.currentDrawer === playerId
      ) {
        this.gameState.isActive = false;
        this.gameState.statusMessage = {
          type: 'failure',
          message: 'Game ended - drawer left the game',
        };
        await this.state.storage.put('gameState', this.gameState);
      }
    } catch (error) {
      console.error('Error leaving game:', error);
      throw error;
    }
  }

  private async handleStartGame({ playerId }: StartGameRequest) {
    try {
      if (this.gameState.isActive) return;

      const randomWord =
        GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
      this.gameState = {
        isActive: true,
        targetWord: randomWord,
        timeRemaining: this.GAME_DURATION,
        guesses: [],
        hasWon: false,
        currentDrawer: playerId,
        endTime: Date.now() + this.GAME_DURATION * 1000,
      };

      await this.state.storage.put('gameState', this.gameState);

      this.startGameTimer();
      this.broadcast({
        type: 'gameStarted',
      });

      if (this.gameState.endTime) {
        await this.state.storage.setAlarm(this.gameState.endTime);
      }
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  }

  private startGameTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (!this.gameState.isActive) {
        if (this.timerInterval !== null) {
          clearInterval(this.timerInterval);
        }
        return;
      }

      const now = Date.now();
      if (this.gameState.endTime) {
        this.gameState.timeRemaining = Math.max(
          0,
          Math.ceil((this.gameState.endTime - now) / 1000)
        );

        this.broadcast({
          type: 'gameState',
          gameState: this.gameState,
          users: Array.from(this.users.entries()).map(([id, data]) => ({
            id,
            ...data,
          })),
        });

        if (this.gameState.timeRemaining <= 0) {
          clearInterval(this.timerInterval);
        }
      }
    }, 1000) as unknown as number;
  }

  private async handleGuess({ playerId, guess }: GuessRequest) {
    try {
      if (!this.gameState.isActive) return;

      const newGuess = {
        guess: guess.toLowerCase(),
        timestamp: Date.now(),
        playerId,
      };

      this.gameState.guesses.push(newGuess);

      if (guess.toLowerCase() === this.gameState.targetWord.toLowerCase()) {
        const player = this.users.get(playerId);
        if (player) {
          player.score += Math.ceil(this.gameState.timeRemaining / 2);
          this.users.set(playerId, player);
          await this.state.storage.put('users', this.users);
        }

        this.gameState.hasWon = true;
        this.gameState.isActive = false;
        this.gameState.timeRemaining = 0;
        this.gameState.endTime = undefined;
        this.gameState.statusMessage = {
          type: 'success',
          message: `${player?.name || 'Player'} guessed correctly: "${
            this.gameState.targetWord
          }"!`,
        };

        if (this.timerInterval) {
          clearInterval(this.timerInterval);
        }
        
        await this.state.storage.deleteAlarm();
      }

      await this.state.storage.put('gameState', this.gameState);
    } catch (error) {
      console.error('Error handling guess:', error);
      throw error;
    }
  }

  private async handleDrawingUpdate({ drawingData }: DrawingUpdateRequest) {
    try {
      if (!this.gameState.isActive) return;

      this.gameState.drawingData = drawingData;
      await this.state.storage.put('gameState', this.gameState);
    } catch (error) {
      console.error('Error handling drawing update:', error);
      throw error;
    }
  }

  private broadcast(message: any) {
    try {
      const messageStr = JSON.stringify(message);
      for (const ws of this.state.getWebSockets()) {
        try {
          ws.send(messageStr);
        } catch (error) {
          console.error('Error sending message to WebSocket:', error);
        }
      }
    } catch (error) {
      console.error('Error broadcasting message:', error);
      throw error;
    }
  }

  async alarm() {
    try {
      if (this.gameState.isActive) {
        this.gameState.isActive = false;
        this.gameState.statusMessage = {
          type: 'failure',
          message: `Time's up! The word was "${this.gameState.targetWord}"`,
        };
        await this.state.storage.put('gameState', this.gameState);
        this.broadcast({
          type: 'gameEnded',
          gameState: this.gameState,
          users: Array.from(this.users.entries()).map(([id, data]) => ({
            id,
            ...data,
          })),
        });
      }

      if (this.users.size === 0) {
        await this.state.storage.deleteAll();
      }
    } catch (error) {
      console.error('Error handling alarm:', error);
      throw error;
    }
  }
}
