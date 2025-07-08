'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchStreams } from '../api/streams';
import type { Stream } from '@/entities/stream/model/types';
import * as styles from './StreamList.css';

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
    <div className={styles.grid}>
      {streams.length === 0 ? (
        <div>현재 라이브 방송이 없습니다.</div>
      ) : (
        streams.map((stream) => (
          <Link key={stream.id} href={`/streams/${stream.id}`} className={styles.card}>
            {/* 썸네일 */}
            <div className={styles.thumbnail}>
              {/* LIVE 뱃지 */}
              {stream.isLive && <span className={styles.liveBadge}>LIVE</span>}
              <img
                src="/images/stream-thumb-default.jpg"
                alt="썸네일"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }}
              />
            </div>
            {/* 방송 제목 */}
            <div className={styles.title}>{stream.title}</div>
            {/* 스트리머/시청자수 */}
            <div className={styles.infoRow}>
              <div className={styles.profile}>
                <img
                  src={stream.streamer.profileImageUrl || '/images/default-profile.png'}
                  alt="프로필"
                  className={styles.profileImg}
                />
                <span className={styles.nickname}>{stream.streamer.nickname}</span>
              </div>
              <div className={styles.viewers}>
                <span role="img" aria-label="시청자">
                  👁️
                </span>
                {stream.viewers}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
