import type { Ai } from '@cloudflare/workers-types';

export type Env = {
  AI: Ai;
};

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameMessage {
  type: 'CHAT' | 'GUESS' | 'SYSTEM';
  playerId: string;
  playerName: string;
  content: string;
  timestamp: number;
}

export interface GameState {
  isActive: boolean;
  targetWord: string;
  timeRemaining: number;
  endTime?: number;
  guesses: Array<{
    guess: string;
    timestamp: number;
    playerId: string;
  }>;
  hasWon: boolean;
  currentDrawer?: string;
  drawingData?: string;
  statusMessage?: {
    type: 'success' | 'failure';
    message: string;
  };
}

// Request types
export interface JoinRequest {
  playerId: string;
  playerName: string;
}

export interface LeaveRequest {
  playerId: string;
}

export interface StartGameRequest {
  playerId: string;
}

export interface GuessRequest {
  playerId: string;
  guess: string;
}

export interface DrawingUpdateRequest {
  drawingData: string;
}

// Response types
export interface BaseResponse {
  ok: boolean;
  success: boolean;
  message?: string;
  statusCode?: number;
}

export interface GameStateResponse extends BaseResponse {
  gameState: GameState;
  users: Array<{
    id: string;
    name: string;
    score: number;
  }>;
}
