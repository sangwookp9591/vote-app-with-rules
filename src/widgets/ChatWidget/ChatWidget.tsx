import ChatPanel from '@/features/chat/ui/ChatPanel';
import * as styles from '@/features/streams/ui/StreamRoom.css';
import type { Stream } from '@/entities/stream/model/types';
import { useEffect, useRef } from 'react';
// hls.js 타입 에러 방지: 타입 선언 파일이 없으므로 아래 @ts-expect-error 사용
import Hls from 'hls.js';
import { User } from 'next-auth';

export default function ChatWidget({
  stream,
  user,
  isStreamer,
}: {
  stream: Stream;
  user: User | undefined;
  isStreamer: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!stream?.isLive || !stream?.streamKey) return;
    if (!videoRef.current) return;
    // 스트리머도 방송 미리보기를 볼 수 있도록 조건 제거
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(`http://localhost:8080/live/${stream.streamKey}.m3u8`);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = `http://localhost:8080/live/${stream.streamKey}.m3u8`;
    }
  }, [stream, user?.id]);
  return (
    <div className={styles.flexRow}>
      <div className={styles.playerAreaCol}>
        {/* <div
          className={
            stream.isLive ? `${styles.playerArea} ${styles.playerAreaLive}` : styles.playerArea
          }
        > */}
        {stream.isLive && (
          <div style={{ margin: '16px 0' }}>
            {/* 스트리머에게만 안내 문구 노출 */}
            {isStreamer && (
              <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
                이 화면은 실제 방송 송출 미리보기(HLS 기준, 약간의 지연 있음)입니다.
              </div>
            )}
            <video
              className={
                stream.isLive ? `${styles.playerArea} ${styles.playerAreaLive}` : styles.playerArea
              }
              ref={videoRef}
              controls
              autoPlay
              style={{ width: '100%', maxWidth: 800 }}
              src={`http://localhost:8080/live/${stream.streamKey}.m3u8`}
            />
          </div>
        )}
        {/* </div> */}
      </div>
      <div className={styles.chatArea}>
        {stream.isLive ? (
          <ChatPanel roomId={stream.id} user={user?.nickname} />
        ) : (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
            방송이 시작되면 채팅이 활성화됩니다.
          </div>
        )}
      </div>
    </div>
  );
}
