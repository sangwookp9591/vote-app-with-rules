'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchStream, updateStream } from '../api/streams';
import type { Stream } from '@/entities/stream/model/types';
import ChatWidget from '@/widgets/ChatWidget/ChatWidget';
import * as styles from './StreamRoom.css';
import Image from 'next/image';
import socket from '@/shared/api/socketClient';

// 테스트용 LiveKit 서버 URL/토큰 (실서비스에서는 백엔드에서 발급 필요)
const LIVEKIT_URL = 'wss://demo.livekit.io';
const TEST_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb29tIjoidGVzdC1yb29tIiwidXNlcklkIjoidGVzdC11c2VyIiwicm9sZXMiOlsidXNlciJdLCJleHAiOjQ3OTg2NDAwMDB9.2Qn6QwQw6QwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw';

export default function StreamRoom() {
  const params = useParams();
  const streamId = params?.id as string;
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [viewerCount, setViewerCount] = useState(0);

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

  const handleStart = async () => {
    if (!stream) return;
    setActionLoading(true);
    setActionError('');
    try {
      const updated = await updateStream(stream.id, { isLive: true });
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
        setActionError('방송 시작 실패');
      }
    } finally {
      setActionLoading(false);
    }
  };

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
      {/* 방송 시작/종료 버튼 (실무에선 스트리머 본인만 노출) */}
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
            onClick={handleStart}
            disabled={actionLoading}
            className={styles.actionButton}
            data-variant="start"
          >
            {actionLoading ? '시작 중...' : '방송 시작'}
          </button>
        )}
        {actionError && <div className={styles.actionError}>{actionError}</div>}
      </div>
      <ChatWidget stream={stream} livekitUrl={LIVEKIT_URL} livekitToken={TEST_TOKEN} />
    </div>
  );
}
