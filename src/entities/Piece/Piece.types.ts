import { JSX } from 'react';

export interface PieceState {
  code: number;
  id: string;
  PieceComponent?: JSX.Element | null;
}

export enum PieceColor {
  RED = 'red',
  WHITE = 'white',
}

export interface PieceProps {
  color: PieceColor;
  className?: string;
  onClick?: () => void;
  isRemoving?: boolean;
}

export type Position = { x: number; y: number };
