'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchStreams, fetchViewerCounts } from '../api/streams';
import type { Stream } from '@/entities/stream/model/types';
import * as styles from './StreamList.css';
import StreamCreateForm from './StreamCreateForm';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function StreamList() {
  const { data: session } = useSession();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [viewerCounts, setViewerCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchStreams()
      .then(setStreams)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    // 시청자 수는 최초 1회만 fetch
    fetchViewerCounts()
      .then(setViewerCounts)
      .catch(() => {});
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '0 0 16px 0',
          padding: '0 24px',
        }}
      >
        <h2 style={{ margin: 0 }}>라이브 방송방 목록</h2>
        <button
          onClick={() => setShowCreate((v) => !v)}
          style={{
            background: '#4f9fff',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 20px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          방송 시작
        </button>
      </div>
      {showCreate && (
        <div style={{ margin: '0 0 24px 0', padding: '0 24px' }}>
          <StreamCreateForm streamerId={session?.user?.id || ''} />
        </div>
      )}
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
                <Image
                  src="/images/lol.png" // 기본 이미지로 변경 (stream-thumb-default.jpg 대신)
                  alt="썸네일"
                  fill
                  className={styles.thumbnailImg}
                  sizes="(max-width: 600px) 100vw, 400px"
                  priority
                />
              </div>
              {/* 방송 제목 */}
              <div className={styles.title}>{stream.title}</div>
              {/* 스트리머/시청자수 */}
              <div className={styles.infoRow}>
                <div className={styles.profile}>
                  <Image
                    src={stream.streamer.profileImageUrl || '/images/default-profile.png'}
                    alt="프로필"
                    width={28}
                    height={28}
                    className={styles.profileImg}
                  />
                  <span className={styles.nickname}>{stream.streamer.nickname}</span>
                </div>
                <div className={styles.viewers}>
                  <span role="img" aria-label="시청자">
                    👁️
                  </span>
                  {/* 실시간 시청자 수가 있으면 표시, 없으면 DB값 */}
                  {viewerCounts[stream.id] ?? stream.viewers}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
