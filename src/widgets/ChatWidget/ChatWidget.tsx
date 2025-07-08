import { LiveKitRoom } from '@livekit/components-react';
import ChatPanel from '@/features/chat/ui/ChatPanel';
import * as styles from '@/features/streams/ui/StreamRoom.css';
import type { Stream } from '@/entities/stream/model/types';
import { useSession } from 'next-auth/react';

interface ChatWidgetProps {
  stream: Stream;
  livekitUrl: string;
  livekitToken: string;
}

export default function ChatWidget({ stream, livekitUrl, livekitToken }: ChatWidgetProps) {
  const { data: session } = useSession();
  const user = session?.user?.nickname;

  return (
    <div className={styles.flexRow}>
      <div className={styles.playerAreaCol}>
        <div
          className={
            stream.isLive ? `${styles.playerArea} ${styles.playerAreaLive}` : styles.playerArea
          }
        >
          {stream.isLive ? (
            <LiveKitRoom
              serverUrl={livekitUrl}
              token={livekitToken}
              connect={true}
              video={true}
              audio={true}
              style={{ width: '100%', height: '100%' }}
            >
              {/* LiveKit 기본 UI (참여자, 비디오 등) */}
            </LiveKitRoom>
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
