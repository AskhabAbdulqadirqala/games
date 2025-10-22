import { Checker } from '@entities/Checker/Checker.types';

export interface ServerToClientEvents {
  sessionCreated: (sessionId: string) => void;
  gameStarted: (data: { sessionId: string; players: string[] }) => void;
  moveMade: (gameState: { checkers: Checker[] }) => void;
  playerDisconnected: () => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  createSession: () => void;
  joinSession: (sessionId: string) => void;
  makeMove: (data: {
    sessionId: string;
    move: { checkers: Checker[] };
  }) => void;
}
