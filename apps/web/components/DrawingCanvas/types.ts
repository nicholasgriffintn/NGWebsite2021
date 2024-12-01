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
  onGuess?: (drawingData: string) => Promise<any>;
}

export type { DrawingResponse, DrawingCanvasProps };

export interface GameState {
  isActive: boolean;
  targetWord: string;
  timeRemaining: number;
  guesses: Array<{
    guess: string;
    timestamp: number;
  }>;
  hasWon: boolean;
  statusMessage?: {
    type: 'success' | 'failure';
    message: string;
  };
}

export type GameActions = {
  startGame: () => void;
  endGame: () => void;
  handleGuess: (drawingData: string) => Promise<void>;
};
