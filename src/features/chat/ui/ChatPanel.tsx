import React, { useEffect, useState } from 'react';
import socket from '@/shared/api/socketClient';
import { sendChatMessage, joinChatRoom } from '../api/chatSocket';

type ChatMessage = {
  type: string;
  user?: string;
  message: string;
  timestamp?: number;
  roomId?: string;
};

interface ChatPanelProps {
  roomId: string;
  user?: string;
}

export default function ChatPanel({ roomId, user }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (roomId && user) {
      joinChatRoom(roomId, user);
    }

    const handler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat' || data.type === 'system') {
          setMessages((prev) => [...prev, data]);
        }
      } catch {}
    };

    socket.addEventListener('message', handler);
    return () => {
      socket.removeEventListener('message', handler);
    };
  }, [roomId, user]);

  const handleSend = () => {
    if (input && user) {
      sendChatMessage(input);
      setInput('');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, maxWidth: 400 }}>
      <div style={{ minHeight: 120, marginBottom: 8, maxHeight: 200, overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            {msg.type === 'system' ? (
              <span style={{ color: '#888' }}>{msg.message}</span>
            ) : (
              <>
                <b>{msg.user}</b>: {msg.message}
                <span style={{ color: '#aaa', fontSize: 10, marginLeft: 8 }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '70%', marginRight: 8 }}
        placeholder={user ? '메시지를 입력하세요' : '로그인 후 채팅 가능'}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={!user}
      />
      <button onClick={handleSend} disabled={!user}>
        전송
      </button>
      {!user && (
        <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
          로그인해야 채팅을 보낼 수 있습니다.
        </div>
      )}
    </div>
  );
}
