import {
  GameState,
  JoinRequest,
  LeaveRequest,
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
    const body = (await request.json()) as { action: string; data: any };
    const action = body.action;

    switch (action) {
      case 'getUsers':
        return await this.handleGetUsers(request);
      case 'join':
        return await this.handleJoin(body.data);
      case 'leave':
        return await this.handleLeave(body.data);
      case 'startGame':
        return await this.handleStartGame(body);
      case 'endGame':
        return await this.handleEndGame();
      case 'submitGuess':
        return await this.handleGuess(body);
      case 'updateDrawing':
        return await this.handleDrawingUpdate(body);
      case 'getState':
        return await this.handleGetState();
      default:
        return new Response(
          JSON.stringify({
            ok: false,
            message: 'Not found',
            statusCode: 404,
          }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    }
  }

  private async handleGetUsers(request: Request): Promise<Response> {
    return new Response(JSON.stringify(this.users));
  }

  private async handleJoin(body: any): Promise<Response> {
    try {
      const { playerId, playerName } = body as JoinRequest;

      if (!playerId || !playerName) {
        return new Response(
          JSON.stringify({
            ok: false,
            success: false,
            message: 'Missing playerId or playerName',
            statusCode: 400,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (this.users.has(playerId)) {
        return new Response(JSON.stringify({ ok: true, success: true }));
      }

      this.users.set(playerId, { name: playerName, score: 0 });
      await this.state.storage.put('users', this.users);

      return new Response(
        JSON.stringify({
          ok: true,
          success: true,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          ok: false,
          success: false,
          message: 'Failed to join game',
          statusCode: 400,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  private async handleLeave(body: any): Promise<Response> {
    try {
      const { playerId } = body as LeaveRequest;

      if (!playerId) {
        return new Response(
          JSON.stringify({
            ok: false,
            success: false,
            message: 'Missing playerId',
            statusCode: 400,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      this.users.delete(playerId);
      await this.state.storage.put('users', this.users);

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

      return new Response(
        JSON.stringify({
          ok: true,
          success: true,
          gameState: this.gameState,
          users: Array.from(this.users.entries()).map(([id, data]) => ({
            id,
            ...data,
          })),
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          ok: false,
          success: false,
          message: 'Failed to leave game',
          statusCode: 400,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  private async handleStartGame(body: any) {
    try {
      const { playerId } = body as StartGameRequest;

      if (!playerId) {
        return new Response(
          JSON.stringify({
            ok: false,
            success: false,
            message: 'Missing playerId',
            statusCode: 400,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (this.gameState.isActive) {
        return new Response(
          JSON.stringify({
            ok: false,
            success: false,
            message: 'Game already in progress',
          })
        );
      }

      const randomWord =
        GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];

      this.gameState = {
        isActive: true,
        targetWord: randomWord,
        timeRemaining: this.GAME_DURATION,
        guesses: [],
        hasWon: false,
        currentDrawer: playerId,
      };

      await this.startTimer();

      await this.state.storage.put('gameState', this.gameState);
      return new Response(
        JSON.stringify({ ok: true, success: true, gameState: this.gameState })
      );
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ ok: false, success: false }));
    }
  }

  private async handleGuess(body: any): Promise<Response> {
    try {
      const { playerId, guess } = body as GuessRequest;

      if (!playerId || !guess) {
        return new Response(
          JSON.stringify({
            ok: false,
            success: false,
            message: 'Missing playerId or guess',
            statusCode: 400,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (!this.gameState.isActive) {
        return new Response(
          JSON.stringify({
            ok: false,
            success: false,
            message: 'No active game',
            statusCode: 400,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

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
        this.gameState.statusMessage = {
          type: 'success',
          message: `${player?.name || 'Player'} guessed correctly: "${
            this.gameState.targetWord
          }"!`,
        };
      }

      await this.state.storage.put('gameState', this.gameState);

      return new Response(
        JSON.stringify({
          ok: true,
          success: true,
          gameState: this.gameState,
          users: Array.from(this.users.entries()).map(([id, data]) => ({
            id,
            ...data,
          })),
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          ok: false,
          success: false,
          message: 'Failed to process guess',
          statusCode: 400,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  private async handleDrawingUpdate(body: any): Promise<Response> {
    try {
      const { drawingData } = body as DrawingUpdateRequest;

      if (!drawingData) {
        return new Response(
          JSON.stringify({
            ok: false,
            success: false,
            message: 'Missing drawingData',
            statusCode: 400,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (!this.gameState.isActive) {
        return new Response(
          JSON.stringify({
            ok: false,
            success: false,
            message: 'No active game',
            statusCode: 400,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      this.gameState.drawingData = drawingData;
      await this.state.storage.put('gameState', this.gameState);

      return new Response(
        JSON.stringify({
          ok: true,
          success: true,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          ok: false,
          success: false,
          message: 'Failed to update drawing',
          statusCode: 400,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  private async handleEndGame() {
    this.gameState.isActive = false;
    if (!this.gameState.hasWon) {
      this.gameState.statusMessage = {
        type: 'failure',
        message: `Time's up! The word was "${this.gameState.targetWord}"`,
      };
    }

    await this.state.storage.put('gameState', this.gameState);
    return new Response(
      JSON.stringify({ ok: true, success: true, gameState: this.gameState })
    );
  }

  private async handleGetState() {
    if (this.gameState.isActive && this.gameState.endTime) {
      const now = Date.now();
      this.gameState.timeRemaining = Math.max(0, Math.ceil((this.gameState.endTime - now) / 1000));
    }

    return new Response(
      JSON.stringify({
        ok: true,
        gameState: this.gameState,
        users: Array.from(this.users.entries()).map(([id, data]) => ({
          id,
          ...data,
        })),
      })
    );
  }

  private async startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const gameEndTime = Date.now() + this.gameState.timeRemaining * 1000;
    await this.state.storage.setAlarm(gameEndTime);

    this.gameState.endTime = gameEndTime;
    await this.state.storage.put('gameState', this.gameState);
  }

  async alarm() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.gameState.isActive) {
      await this.handleEndGame();
    }

    if (this.users.size === 0) {
      await this.state.storage.deleteAll();
    }
  }
}
