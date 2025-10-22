import { Position } from '@shared/types/board.types';

export interface Checker {
  id: string;
  code: number;
  position: Position;
  isKing?: boolean;
}
