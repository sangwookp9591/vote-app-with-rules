import React, { useEffect, useRef, useState } from 'react';
import socket from '@/shared/api/socketClient';
import { sendChatMessage, joinChatRoom } from '../api/chatSocket';
import * as styles from './ChatPanel.css';
import { VirtualList } from '@/shared/ui/list/VirtualList';

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

function getUserColor(nickname?: string) {
  if (!nickname) return '#888';
  const colors = ['#2d8cff', '#ff5c5c', '#00b894', '#fdcb6e', '#a29bfe', '#e17055', '#00bfae'];
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) hash += nickname.charCodeAt(i);
  return colors[hash % colors.length];
}

const MAX_MESSAGES = 100;

export default function ChatPanel({ roomId, user }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId && user) {
      joinChatRoom(roomId, user);
    }

    const handler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat' || data.type === 'system') {
          setMessages((prev) => {
            const next = [...prev, data];
            return next.length > MAX_MESSAGES ? next.slice(next.length - MAX_MESSAGES) : next;
          });
        }
        if (data.type === 'viewerCount' && data.roomId === roomId) {
          setViewerCount(data.count);
        }
      } catch {}
    };

    socket.addEventListener('message', handler);
    return () => {
      socket.removeEventListener('message', handler);
    };
  }, [roomId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input && user) {
      sendChatMessage(input);
      setInput('');
    }
  };

  return (
    <div className={styles.chatPanel}>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>👀 시청자 {viewerCount}명</div>
      <div className={styles.messagesArea}>
        <VirtualList
          items={messages}
          itemHeight={32}
          height={32 * 20}
          renderItem={(msg, i) => (
            <div key={i} className={styles.messageRow}>
              {msg.type === 'system' ? (
                <span className={styles.systemMessage}>{msg.message}</span>
              ) : (
                <>
                  <span className={styles.badge}>K</span>
                  <span className={styles.nickname} style={{ color: getUserColor(msg.user) }}>
                    {msg.user}
                  </span>
                  <span className={styles.message}>{msg.message}</span>
                  {/* <span style={{ color: '#aaa', fontSize: 11, marginLeft: 6 }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                </span> */}
                </>
              )}
            </div>
          )}
        />
        {messages.map((msg, i) => (
          <div key={i} className={styles.messageRow}>
            {msg.type === 'system' ? (
              <span className={styles.systemMessage}>{msg.message}</span>
            ) : (
              <>
                <span className={styles.badge}>K</span>
                <span className={styles.nickname} style={{ color: getUserColor(msg.user) }}>
                  {msg.user}
                </span>
                <span className={styles.message}>{msg.message}</span>
                {/* <span style={{ color: '#aaa', fontSize: 11, marginLeft: 6 }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                </span> */}
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={user ? '메시지를 입력하세요' : '로그인 후 채팅 가능'}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComposing) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={!user}
        />
        <button className={styles.sendButton} onClick={handleSend} disabled={!user}>
          전송
        </button>
      </div>
      {!user && (
        <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
          로그인해야 채팅을 보낼 수 있습니다.
        </div>
      )}
    </div>
  );
}
