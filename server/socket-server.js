import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: '/api/socket',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('join', (userId) => {
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

server.listen(4000, () => {
  console.log('Socket.IO 서버가 4000번 포트에서 실행 중입니다.');
});

app.use(express.json());
app.post('/emit', (req, res) => {
  const { userId, notification } = req.body;
  if (userId && notification) {
    io.to(userId).emit('notification', notification);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'userId, notification required' });
  }
});

app.listen(4000, () => {
  console.log('REST endpoint for emit is running on port 4000');
});
