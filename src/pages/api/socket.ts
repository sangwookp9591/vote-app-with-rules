import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: Server | undefined;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyRes = res as any;
  if (!anyRes.socket || !anyRes.socket.server) {
    res.status(500).end('Socket server not available');
    return;
  }
  if (!anyRes.socket.server.io) {
    io = new Server(anyRes.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    anyRes.socket.server.io = io;
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      socket.on('join', (userId: string) => {
        if (userId) {
          socket.join(userId);
          console.log(`Socket ${socket.id} joined room ${userId}`);
        }
      });
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });
    console.log('Socket.IO 서버가 초기화되었습니다.');
  }
  res.end();
}
