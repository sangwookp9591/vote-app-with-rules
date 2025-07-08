// ws 설치 필요: npm install ws
const WebSocket = require('ws');

const PORT = 5001;
const wss = new WebSocket.Server({ port: PORT });

// 방별로 클라이언트 관리
const rooms = {};

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
      ws.user = data.user || '익명';
      ws.roomId = data.roomId || 'default';
      if (!rooms[ws.roomId]) rooms[ws.roomId] = new Set();
      rooms[ws.roomId].add(ws);
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
    }
  });
});

console.log(`WebSocket 채팅 서버가 ${PORT}번 포트에서 실행 중!`);
