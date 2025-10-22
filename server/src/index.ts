import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { GameSession } from './types';

const FRONTEND_URL = 'http://localhost:5173';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const sessions: Map<string, GameSession> = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);  
  const log = (sessionId: string, ...messages: any) => {
    console.log(`[${new Date().toLocaleString()}, session: ${sessionId}, user: ${socket.id}]: `, ...messages);
  }

  // Создание новой сессии
  socket.on('createSession', () => {
    const sessionId = uuidv4();

    try {
      log(sessionId, `Creating session`);

      sessions.set(sessionId, {
        id: sessionId,
        players: [socket.id],
        gameState: null
      });
      socket.join(sessionId);
      socket.emit('sessionCreated', sessionId);
      
      log(sessionId, `Sessions after creation: `, Array.from(sessions.entries()));
    } catch (error) {
      log(sessionId, `Error in createSession: `, error);
    }
  });

  // Присоединение к существующей сессии
  socket.on('joinSession', (sessionId: string) => {
    try {
      log(sessionId, `Join session event received. Available sessions: `, Array.from(sessions.entries()));

      const session = sessions.get(sessionId);

      if (!session) {
        log(sessionId, `Session not found`);
        socket.emit('error', 'Session not found');
        return;
      }

      if (session.players.length >= 2) {
        log(sessionId, `Session is full`);
        socket.emit('error', 'Session is full');
        return;
      }

      log(sessionId, `Current players: `, session.players);
      session.players.push(socket.id);
      socket.join(sessionId);

      log(sessionId, `Updated players: `, session.players);

      // Оповещаем всех участников сессии о начале игры
      const gameStartData = {
        sessionId,
        players: session.players
      };
      
      log(sessionId, `Emitting gameStarted with data: `, gameStartData);
      io.to(sessionId).emit('gameStarted', gameStartData);

      log(sessionId, `Client successfully joined session`);
    } catch (error) {
      log(sessionId, `Error in joinSession: `, error);
      socket.emit('error', 'Internal server error');
    }
  });

  // Обработка хода
  socket.on('makeMove', ({ sessionId, move }) => {
    log(sessionId, `Received move: `, move);
    const session = sessions.get(sessionId);

    if (session) {
      socket.to(sessionId).emit('moveMade', move);
      log(sessionId, `Move broadcasted to session`);
    }
  });

  socket.on('disconnect', () => {
    sessions.forEach((session, sessionId) => {
      if (session.players.includes(socket.id)) {
        io.to(sessionId).emit('playerDisconnected');
        sessions.delete(sessionId);
      }
    });
  });
});

io.engine.on("connection_error", (err) => {
  console.log('Connection error:', err);
});

io.engine.on("headers", (headers, req) => {
  console.log('Headers:', headers);
});

io.use((socket, next) => {
  console.log('Socket middleware triggered. Socket ID:', socket.id);
  next();
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
