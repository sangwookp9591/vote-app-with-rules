import { NextRequest } from 'next/server';
import { Server } from 'socket.io';
import { NextApiResponse } from 'next';

// Next.js app router에서 socket.io 서버를 싱글턴으로 관리하는 패턴
// (서버리스 환경에서 여러 번 생성되는 것을 방지)
let io: Server | undefined = (global as any).io;

export const config = {
  api: {
    bodyParser: false,
  },
};

// 실무 패턴: io 인스턴스를 글로벌로 export해서 다른 API(알림 생성 등)에서 emit 가능하게 함
export function getIO() {
  return io;
}

export default async function handler(req: any, res: NextApiResponse) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    (global as any).io = io;
    res.socket.server.io = io;
    // 기본 연결/해제 이벤트
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      // 클라이언트에서 userId를 join하면 해당 room에 등록
      socket.on('join', (userId: string) => {
        if (userId) {
          socket.join(userId);
          console.log(`Socket ${socket.id} joined room ${userId}`);
        }
      });
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
      // 테스트용 이벤트
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });
    console.log('Socket.IO 서버가 초기화되었습니다.');
  }
  res.end();
}
