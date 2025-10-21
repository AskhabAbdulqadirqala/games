import { Position } from "@entities/Piece";

export interface Checker {
  id: string;
  code: number;
  position: Position;
  isKing?: boolean;
}
