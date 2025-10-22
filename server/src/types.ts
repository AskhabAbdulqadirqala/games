export type PieceCode = number;

export interface Position {
  x: number;
  y: number;
}

export interface Checker {
  id: string;
  code: PieceCode;
  position: Position;
  isKing?: boolean;
}

export interface GameState {
  checkers: Checker[];
  currentPlayer: PieceCode;
}


export interface GameSession {
  id: string;
  players: string[];
  gameState: any;
}
