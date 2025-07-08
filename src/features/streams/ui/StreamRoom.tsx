import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchStream } from '../api/streams';
import type { Stream } from '@/entities/stream/model/types';

export default function StreamRoom() {
  const params = useParams();
  const streamId = params?.id as string;
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!streamId) return;
    fetchStream(streamId)
      .then(setStream)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [streamId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!stream) return <div>방송방 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>{stream.title}</h2>
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
      {/* 추후 WebRTC 플레이어/채팅 등 확장 */}
      <div style={{ marginTop: 32, color: '#aaa' }}>
        (여기에 WebRTC 플레이어/채팅 등 실시간 기능이 들어갈 예정입니다)
      </div>
    </div>
  );
}
