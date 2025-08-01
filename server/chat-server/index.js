// eslint-disable-next-line @typescript-eslint/no-var-requires
// import 스타일로 변경
import { WebSocketServer, WebSocket } from 'ws'; // WebSocket도 import 추가
import { createClient } from 'redis';

// 환경변수에서 포트 번호를 읽고, 없으면 5000번 사용
const PORT = process.env.NEXT_PUBLIC_CHAT_SERVER_PORT || 5001;
const wss = new WebSocketServer({ port: PORT });

// 방별로 클라이언트 관리
const rooms = {};

const redis = createClient({ url: process.env.NEXT_PUBLIC_REDIS_URL });

// Redis 연결 재시도 로직 (최대 5회, 1초 간격)
async function connectRedisWithRetry(retryCount = 5, delayMs = 1000) {
  for (let i = 0; i < retryCount; i++) {
    try {
      await redis.connect();
      console.log('Redis 연결 성공!');
      return;
    } catch (err) {
      console.error(`Redis 연결 실패 (${i + 1}/${retryCount})`, err);
      if (i < retryCount - 1) {
        // 1초 대기 후 재시도
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        throw err; // 마지막 시도도 실패하면 에러 throw
      }
    }
  }
}

// 서버 시작 시 Redis 연결 시도
connectRedisWithRetry();

function broadcastViewerCount(roomId) {
  const count = rooms[roomId]?.size || 0;
  const msg = JSON.stringify({ type: 'viewerCount', roomId, count });

  //해당 방의 모든 클라이언트에게 msg전송 (방 카운트 업데이트정보)
  rooms[roomId]?.forEach((client) => {
    /**
     * 값 (숫자)	상수명	의미
      0	CONNECTING	연결 시도 중
      1	OPEN	연결 완료, 데이터 송수신 가능
      2	CLOSING	연결 종료 중
      3	CLOSED	연결 종료됨

     */
    // Node.js 환경에서는 WebSocket.OPEN 사용 (ws 라이브러리)
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
  // Redis에 시청자 수 저장 (분산 환경 대응)
  redis.set(`viewerCount:${roomId}`, count.toString());
}

// 방별 시청자 수를 반환하는 함수 (REST API에서 import해서 사용)
export function getViewerCounts() {
  const result = {};
  for (const roomId in rooms) {
    result[roomId] = rooms[roomId]?.size || 0;
  }
  return result;
}

//"새 클라이언트가 서버에 접속할 때마다 handler를 실행"
wss.on('connection', function connection(ws) {
  // 클라이언트가 보낸 첫 메시지로 닉네임/방 지정
  ws.on('message', function incoming(raw) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
      return;
    }

    // 최초 입장: { type: 'join', roomId, user }
    if (data.type === 'join') {
      //webscoket에 data의 프로퍼티 추가
      ws.user = data.user || '익명';
      ws.roomId = data.roomId || 'default';
      if (!rooms[ws.roomId]) rooms[ws.roomId] = new Set();
      rooms[ws.roomId].add(ws);
      //client user 중복 방지를 위해 set사용
      /**
       *     rooms = {
      "roomA": Set( ws1, ws2, ... ),
      "roomB": Set( ws3, ws4, ... ),
    }
       */
      broadcastViewerCount(ws.roomId); // 입장 시 시청자 수 브로드캐스트
      ws.send(
        JSON.stringify({ type: 'system', message: `${ws.user}님 입장`, timestamp: Date.now() }),
      );
      return;
    }

    // 채팅: { type: 'chat', message }
    if (data.type === 'chat' && ws.roomId) {
      const msg = {
        type: 'chat',
        user: ws.user || '익명',
        message: data.message,
        timestamp: Date.now(),
        roomId: ws.roomId,
      };
      // 같은 방에만 브로드캐스트
      rooms[ws.roomId]?.forEach((client) => {
        // Node.js 환경에서는 WebSocket.OPEN 사용 (ws 라이브러리)
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
      return;
    }
  });

  ws.on('close', () => {
    if (ws.roomId && rooms[ws.roomId]) {
      rooms[ws.roomId].delete(ws);
      broadcastViewerCount(ws.roomId); // 퇴장 시 시청자 수 브로드캐스트
    }
  });
});

console.log(`WebSocket 채팅 서버가 ${PORT}번 포트에서 실행 중!`);
