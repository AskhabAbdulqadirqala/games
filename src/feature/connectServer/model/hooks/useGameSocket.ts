import { useEffect, useCallback, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../../connection.types';

const SOCKET_SERVER_URL = 'http://localhost:3001';

export const useGameSocket = () => {
  const socketRef =
    useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<any>(null);

  useEffect(() => {
    if (!socketRef.current) {
      console.log('Initializing socket connection...');

      socketRef.current = io(SOCKET_SERVER_URL, {
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling'],
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected successfully');
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      // Событие создателя сессии.
      socketRef.current.on('sessionCreated', (newSessionId: string) => {
        console.log('Session created with ID:', newSessionId);
        setSessionId(newSessionId);
      });

      // Событие начала игры для второго участника.
      socketRef.current.on('gameStarted', (data) => {
        console.log('Game started event received:', data);
        setSessionId(data.sessionId);
      });

      // Событие хода противника.
      socketRef.current.on('moveMade', (newGameState: any) => {
        console.log('Received move:', newGameState);
        setGameState(newGameState);
      });

      socketRef.current.on('error', (error: string) => {
        console.error('Server error:', error);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const checkConnection = () => {
    if (!socketRef.current?.connected) {
      console.warn('Socket not connected!');

      return false;
    }

    return true;
  };

  const createSession = useCallback(() => {
    console.log('Emitting createSession event');
    socketRef.current?.emit('createSession');
  }, []);

  const joinSession = useCallback((sessionId: string) => {
    console.log('Attempting to join session with ID:', sessionId);

    if (checkConnection()) {
      socketRef.current?.emit('joinSession', sessionId);
    }
  }, []);

  const makeMove = useCallback((sessionId: string, move: any) => {
    if (checkConnection()) {
      console.log('Emitting move:', { sessionId, move });
      socketRef.current?.emit('makeMove', { sessionId, move });
    }
  }, []);

  return {
    socket: socketRef.current!,
    sessionId,
    gameState,
    createSession,
    joinSession,
    makeMove,
  };
};
