'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { fetchStream, updateStream } from '../api/streams';
import type { Stream } from '@/entities/stream/model/types';
import ChatWidget from '@/widgets/ChatWidget/ChatWidget';
import * as styles from './StreamRoom.css';
import Image from 'next/image';
import socket from '@/shared/api/socketClient';
import { useSession } from 'next-auth/react';
// hls.js 타입 에러 방지: 타입 선언 파일이 없으므로 아래 @ts-expect-error 사용
import Hls from 'hls.js';

// 테스트용 LiveKit 서버 URL/토큰 (실서비스에서는 백엔드에서 발급 필요)
const LIVEKIT_URL = 'wss://demo.livekit.io';
const TEST_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb29tIjoidGVzdC1yb29tIiwidXNlcklkIjoidGVzdC11c2VyIiwicm9sZXMiOlsidXNlciJdLCJleHAiOjQ3OTg2NDAwMDB9.2Qn6QwQw6QwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw';

export default function StreamRoom() {
  const params = useParams();
  const streamId = params?.id as string;
  const { data: session } = useSession();
  const user = session?.user;
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [viewerCount, setViewerCount] = useState(0);

  // isStreamer 변수를 useEffect보다 위에 선언
  const isStreamer = user?.id === stream?.streamerId;

  useEffect(() => {
    if (!streamId) return;
    fetchStream(streamId)
      .then(setStream)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [streamId]);

  useEffect(() => {
    if (!stream) return;
    const handler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'viewerCount' && data.roomId === stream.id) {
          setViewerCount(data.count);
        }
      } catch {}
    };
    socket.addEventListener('message', handler);
    return () => socket.removeEventListener('message', handler);
  }, [stream]);

  const handleEnd = async () => {
    if (!stream) return;
    setActionLoading(true);
    setActionError('');
    try {
      const updated = await updateStream(stream.id, {
        isLive: false,
        endedAt: new Date().toISOString(),
      });
      setStream(updated);
    } catch (e: unknown) {
      if (
        e &&
        typeof e === 'object' &&
        'message' in e &&
        typeof (e as { message?: string }).message === 'string'
      ) {
        setActionError((e as { message?: string }).message!);
      } else {
        setActionError('방송 종료 실패');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // SRS WebRTC Publish 페이지로 이동 (방송 시작)
  const handleSrsWebrtcStart = () => {
    if (!stream) return;
    // SRS WebRTC Publish 페이지로 streamKey를 쿼리로 전달
    window.open(
      `http://localhost:8080/players/rtc_publisher.html?stream=${stream.streamKey}`,
      '_blank',
    );
  };

  // HLS 플레이어용 ref
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!stream?.isLive || !stream?.streamKey) return;
    if (!videoRef.current) return;
    if (user?.id === stream.streamerId) return; // 스트리머는 HLS 플레이어 안 보임
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(`http://localhost:8080/hls/${stream.streamKey}.m3u8`);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = `http://localhost:8080/hls/${stream.streamKey}.m3u8`;
    }
  }, [stream, user?.id]);

  // SRS WebRTC Publish 미리보기용 ref
  const localPreviewRef = useRef<HTMLVideoElement>(null);
  // 방송 중일 때 스트리머가 자신의 송출 화면을 방송방에서 볼 수 있도록 미리보기 연결
  useEffect(() => {
    if (!isStreamer || !stream?.isLive) return;
    // 브라우저에서 getUserMedia로 로컬 미리보기 연결
    if (localPreviewRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localPreviewRef.current!.srcObject = stream;
        })
        .catch(() => {});
    }
  }, [isStreamer, stream?.isLive]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!stream) return <div>방송방 정보를 찾을 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.titleRow}>
        {stream.title}
        {stream.isLive && <span className={styles.liveBadge}>LIVE</span>}
      </h2>
      <div className={styles.description}>{stream.description}</div>
      <div className={styles.streamerRow}>
        <b>스트리머:</b> {stream?.streamer?.nickname}
        {stream?.streamer?.profileImageUrl && (
          <Image
            src={stream?.streamer?.profileImageUrl}
            alt="프로필"
            width={32}
            height={32}
            className={styles.profileImg}
          />
        )}
      </div>
      <div className={styles.statusRow}>
        <b>상태:</b> {stream?.isLive ? <span style={{ color: 'green' }}>LIVE</span> : '오프라인'}
      </div>
      <div className={styles.viewersRow}>
        <b>시청자 수:</b> {viewerCount}
      </div>
      {/* 방송 시작/종료 버튼 (스트리머만 노출) */}
      {isStreamer && (
        <div className={styles.buttonRow}>
          {stream.isLive ? (
            <button
              onClick={handleEnd}
              disabled={actionLoading}
              className={styles.actionButton}
              data-variant="end"
            >
              {actionLoading ? '종료 중...' : '방송 종료'}
            </button>
          ) : (
            <button
              onClick={handleSrsWebrtcStart}
              disabled={actionLoading}
              className={styles.actionButton}
              data-variant="start"
            >
              {actionLoading ? '시작 중...' : '브라우저로 방송 시작'}
            </button>
          )}
          {actionError && <div className={styles.actionError}>{actionError}</div>}
        </div>
      )}
      {/* 스트리머는 방송 시작 안내, 시청자는 HLS 플레이어 */}
      {isStreamer ? (
        <div style={{ background: '#f5f7fa', padding: 16, borderRadius: 8, margin: '16px 0' }}>
          <h4>브라우저에서 바로 방송을 시작할 수 있습니다</h4>
          <div style={{ fontSize: 14, marginBottom: 8 }}>
            <b>방송 송출 방법:</b>
            <ol>
              <li>
                <button
                  onClick={handleSrsWebrtcStart}
                  style={{
                    background: '#4f9fff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginBottom: 8,
                  }}
                >
                  SRS WebRTC 방송 시작 페이지 열기
                </button>
              </li>
              <li>
                <b>Stream Name:</b> <code>{stream.streamKey}</code> (자동 입력됨)
              </li>
              <li>
                <b>Start Publish</b> 버튼 클릭 → 웹캠/마이크 허용 → 방송 시작!
              </li>
            </ol>
            <b>시청 주소(HLS):</b> <code>http://localhost:8080/hls/{stream.streamKey}.m3u8</code>
          </div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
            방송을 시작하면 시청자는 위 HLS 주소로 방송을 볼 수 있습니다.
          </div>
          {/* 스트리머가 방송 중이면 자신의 송출 미리보기를 방송방 내에 표시 */}
          {stream.isLive && (
            <div style={{ margin: '16px 0', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                내 송출 미리보기 (이 화면이 방송됩니다)
              </div>
              <video
                ref={localPreviewRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: '100%',
                  maxWidth: 480,
                  borderRadius: 12,
                  border: '2px solid #4f9fff',
                }}
              />
            </div>
          )}
        </div>
      ) : stream.isLive ? (
        <div style={{ margin: '16px 0' }}>
          {/* 시청자는 HLS 플레이어만 노출 */}
          <video
            ref={videoRef}
            controls
            autoPlay
            style={{ width: '100%', maxWidth: 800 }}
            src={`http://localhost:8080/hls/${stream.streamKey}.m3u8`} // HLS 주소를 /hls/로 통일
          />
        </div>
      ) : (
        <div style={{ margin: '16px 0', color: '#888' }}>아직 방송이 시작되지 않았습니다.</div>
      )}
      {/* 채팅 등 부가 기능은 그대로 유지 */}
      <ChatWidget stream={stream} livekitUrl={LIVEKIT_URL} livekitToken={TEST_TOKEN} />
    </div>
  );
}
