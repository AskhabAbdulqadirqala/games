import { Position } from '@shared/types/board.types';
import { Checker } from '@entities/Checker/Checker.types';

export interface CheckersState {
  checkers: Checker[];
  selectedCheckerId: string;
  possibleMoves: Position[];
  currentPlayer: number;
  removingCheckers: string[];
}
