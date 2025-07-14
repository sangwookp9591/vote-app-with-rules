import ChatPanel from '@/features/chat/ui/ChatPanel';
import * as styles from '@/features/streams/ui/StreamRoom.css';
import type { Stream } from '@/entities/stream/model/types';

export default function ChatWidget({ stream, user }: { stream: Stream; user: string }) {
  return (
    <div className={styles.flexRow}>
      <div className={styles.playerAreaCol}>
        <div
          className={
            stream.isLive ? `${styles.playerArea} ${styles.playerAreaLive}` : styles.playerArea
          }
        >
          {stream.isLive ? (
            <div style={{ color: '#4f9fff', textAlign: 'center', padding: 24 }}>
              방송이 진행 중입니다 (OBS/RTMP 기반)
            </div>
          ) : (
            '방송이 시작되지 않았습니다.'
          )}
        </div>
      </div>
      <div className={styles.chatArea}>
        {stream.isLive ? (
          <ChatPanel roomId={stream.id} user={user} />
        ) : (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
            방송이 시작되면 채팅이 활성화됩니다.
          </div>
        )}
      </div>
    </div>
  );
}
