const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5001');

export default socket;
