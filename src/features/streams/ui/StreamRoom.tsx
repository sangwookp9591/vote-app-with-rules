'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchStream, updateStream } from '../api/streams';
import type { Stream } from '@/entities/stream/model/types';
import { LiveKitRoom } from '@livekit/components-react';

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

  useEffect(() => {
    if (!streamId) return;
    fetchStream(streamId)
      .then(setStream)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [streamId]);

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
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {stream.title}
        {stream.isLive && (
          <span
            style={{
              background: '#ff1744',
              color: '#fff',
              borderRadius: 8,
              padding: '2px 10px',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            LIVE
          </span>
        )}
      </h2>
      <div style={{ color: '#888', marginBottom: 8 }}>{stream.description}</div>
      <div style={{ marginBottom: 12 }}>
        <b>스트리머:</b> {stream.streamer.nickname}
        {stream.streamer.profileImageUrl && (
          <img
            src={stream.streamer.profileImageUrl}
            alt="프로필"
            style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 8 }}
          />
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <b>상태:</b> {stream.isLive ? <span style={{ color: 'green' }}>LIVE</span> : '오프라인'}
      </div>
      <div style={{ marginBottom: 12 }}>
        <b>시청자 수:</b> {stream.viewers}
      </div>
      {/* 방송 시작/종료 버튼 (실무에선 스트리머 본인만 노출) */}
      <div style={{ marginBottom: 24 }}>
        {stream.isLive ? (
          <button
            onClick={handleEnd}
            disabled={actionLoading}
            style={{
              background: '#ff1744',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 24px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            {actionLoading ? '종료 중...' : '방송 종료'}
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={actionLoading}
            style={{
              background: '#4f9fff',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 24px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            {actionLoading ? '시작 중...' : '방송 시작'}
          </button>
        )}
        {actionError && <div style={{ color: 'red', marginTop: 8 }}>{actionError}</div>}
      </div>
      {/* WebRTC 플레이어 영역 (LiveKit 연동) */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          background: stream.isLive ? '#222' : '#eee',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: stream.isLive ? '#fff' : '#888',
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 32,
          boxShadow: '0 2px 12px #e0e7ef33',
          overflow: 'hidden',
        }}
      >
        {stream.isLive ? (
          <LiveKitRoom
            serverUrl={LIVEKIT_URL}
            token={TEST_TOKEN}
            connect={true}
            video={true}
            audio={true}
            style={{ width: '100%', height: '100%' }}
          >
            {/* LiveKit 기본 UI (참여자, 비디오, 채팅 등) */}
          </LiveKitRoom>
        ) : (
          '방송이 시작되지 않았습니다.'
        )}
      </div>
    </div>
  );
}
