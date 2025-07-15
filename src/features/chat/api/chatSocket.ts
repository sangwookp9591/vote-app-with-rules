import socket from '@/shared/api/socketClient';

// 서버에 입장(닉네임, 방) 알리기
export function joinChatRoom(roomId: string, user: string) {
  // WebSocket 연결이 열려 있는지 확인
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'join', roomId, user }));
  } else {
    // 아직 연결 중이면 open 이벤트에서 send
    socket.addEventListener(
      'open',
      () => {
        socket.send(JSON.stringify({ type: 'join', roomId, user }));
      },
      { once: true },
    );
  }
}

// 메시지 보내기
export function sendChatMessage(message: string) {
  // WebSocket 연결이 열려 있는지 확인
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'chat', message }));
  } else {
    // 아직 연결 중이면 open 이벤트에서 send
    socket.addEventListener(
      'open',
      () => {
        socket.send(JSON.stringify({ type: 'chat', message }));
      },
      { once: true },
    );
  }
}

// 메시지 받기(구독) - 전체 메시지 구조 전달
// export function subscribeChatMessage(
//   onMessage: (msg: {
//     type: string;
//     user?: string;
//     message: string;
//     timestamp?: number;
//     roomId?: string;
//   }) => void,
// ) {
//   socket.addEventListener('message', (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       if (data.type === 'chat' || data.type === 'system') {
//         onMessage(data);
//       }
//     } catch {
//       // JSON이 아니면 무시
//     }
//   });
// }
