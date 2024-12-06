interface DrawingResponse {
  response: {
    status: string;
    content: string;
    data: {
      drawingUrl: {
        key: string;
      };
      paintingUrl: {
        key: string;
      };
    };
  };
}

interface DrawingCanvasProps {
  onSubmit: (drawingData: string) => Promise<any>;
  result: string | null;
  gameMode?: boolean;
  gameId?: string;
  playerId?: string;
  playerName?: string;
  onGuess?: (drawingData: string) => Promise<any>;
  clearCanvas?: () => void;
}

export type { DrawingResponse, DrawingCanvasProps };

export interface User {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  isActive: boolean;
  isLobby: boolean;
  gameId?: string | null;
  gameName?: string;
  targetWord: string;
  timeRemaining: number;
  guesses: Array<{
    playerId: string;
    playerName: string;
    guess: string;
    timestamp: number;
    correct: boolean;
  }>;
  hasWon: boolean;
  currentDrawer?: string;
  endTime?: number;
  statusMessage?: {
    type: 'success' | 'failure';
    message: string;
  };
  drawingData?: string;
}

export interface BaseResponse {
  ok: boolean;
  success: boolean;
  message?: string;
  statusCode?: number;
}

export interface GameStateResponse extends BaseResponse {
  gameState: GameState;
  users: Array<User>;
}

export type GameActions = {
  startGame: () => void;
  endGame: () => void;
  handleGuess: (drawingData: string) => Promise<void>;
};

export interface GameListItem {
  id: string;
  name: string;
  playerCount: number;
  isLobby: boolean;
  isActive: boolean;
}
