import { Position } from "@entities/Piece";

export interface Checker {
  id: string;
  code: number;
  position: Position;
  isKing?: boolean;
}

export interface CheckersState {
  checkers: Checker[];
  selectedCheckerId: string;
  possibleMoves: Position[];
  currentPlayer: number;
  removingCheckers: string[];
}
