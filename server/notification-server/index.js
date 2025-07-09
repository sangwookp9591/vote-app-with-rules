// 알림 서버: Node.js + socket.io 기반
import { Server } from 'socket.io';
import http from 'http';

// 환경변수에서 포트 가져오기, 기본값 5002
const PORT = process.env.PORT || 5002;

// HTTP 서버 생성
const server = http.createServer();

// socket.io 서버 생성
const io = new Server(server, {
  cors: {
    origin: '*', // 실제 운영시에는 도메인 제한 필요
  },
});

// 클라이언트 연결 시
io.on('connection', (socket) => {
  console.log('알림 서버: 클라이언트 연결됨', socket.id);

  // 예시: 클라이언트가 'notify' 이벤트로 알림 요청 시
  socket.on('notify', (data) => {
    // 모든 클라이언트에게 알림 전송
    io.emit('notification', data);
  });

  // 연결 해제 시
  socket.on('disconnect', () => {
    console.log('알림 서버: 클라이언트 연결 해제', socket.id);
  });
});

// 서버 시작
server.listen(PORT, () => {
  console.log(`알림 서버가 ${PORT}번 포트에서 실행 중!`);
});
