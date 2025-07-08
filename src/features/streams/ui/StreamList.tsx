import { useEffect, useState } from 'react';
import { fetchStreams } from '../api/streams';
import type { Stream } from '@/entities/stream/model/types';

export default function StreamList() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStreams()
      .then(setStreams)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>라이브 방송방 목록</h2>
      {streams.length === 0 ? (
        <div>현재 라이브 방송이 없습니다.</div>
      ) : (
        <ul>
          {streams.map((stream) => (
            <li key={stream.id}>
              <strong>{stream.title}</strong> by {stream.streamer.nickname}
              {stream.isLive && <span style={{ color: 'green', marginLeft: 8 }}>(LIVE)</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
