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
  // hover 상태 관리 (streamKey 기준)
  const [hoveredStreamKey, setHoveredStreamKey] = useState<string | null>(null);

  // 썸네일 이미지 경로 생성 함수
  const getThumbnailUrl = (streamKey: string) => `/thumbnails/${streamKey}.jpg`;
  // HLS 미리보기 영상 경로 생성 함수
  const getHlsUrl = (streamKey: string) => `http://localhost:8080/live/${streamKey}.m3u8`;
  const DEFAULT_THUMBNAIL = '/images/lol.png'; // 기본 썸네일

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
            <Link
              key={stream.id}
              href={`/streams/${stream.id}`}
              className={styles.card}
              onMouseEnter={() => setHoveredStreamKey(stream.streamKey)}
              onMouseLeave={() => setHoveredStreamKey(null)}
            >
              {/* 썸네일 또는 hover 시 미리보기 */}
              <div className={styles.thumbnail}>
                {/* LIVE 뱃지 */}
                {stream.isLive && <span className={styles.liveBadge}>LIVE</span>}
                {hoveredStreamKey === stream.streamKey ? (
                  // hover 시 HLS 미리보기 영상 (음소거, 자동재생, 반복)
                  <video
                    src={getHlsUrl(stream.streamKey)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 0,
                      background: '#000',
                    }}
                    // 에러 발생 시 썸네일로 fallback 처리(간단 예시)
                    onError={(e) => {
                      // 비디오 로딩 실패 시 썸네일로 대체
                      (e.currentTarget as HTMLVideoElement).style.display = 'none';
                    }}
                  />
                ) : (
                  // 썸네일 이미지 (실시간 캡처)
                  <Image
                    src={getThumbnailUrl(stream.streamKey)}
                    alt="썸네일"
                    fill
                    className={styles.thumbnailImg}
                    sizes="(max-width: 600px) 100vw, 400px"
                    priority
                    // 썸네일 로딩 실패 시 기본 이미지로 대체
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = DEFAULT_THUMBNAIL;
                    }}
                  />
                )}
              </div>
              {/* 방송 제목 */}
              <div className={styles.title}>{stream.title}</div>
              {/* --- 카테고리 뱃지 표시 (대분류/소분류) --- */}
              <div style={{ display: 'flex', gap: 6, margin: '0 10px 6px 10px' }}>
                {/* 대분류 뱃지 */}
                <span
                  style={{
                    background: '#eaf6ff',
                    color: '#2176d2',
                    borderRadius: 6,
                    fontSize: 12,
                    padding: '2px 8px',
                    fontWeight: 700,
                  }}
                  title="카테고리 대분류"
                >
                  {stream.categoryType === 'GAME'
                    ? '게임'
                    : stream.categoryType === 'RADIO'
                      ? '보이는 라디오'
                      : stream.categoryType === 'SPORTS'
                        ? '스포츠'
                        : stream.categoryType}
                </span>
                {/* 소분류 뱃지 */}
                <span
                  style={{
                    background: '#f5eaff',
                    color: '#7c3aed',
                    borderRadius: 6,
                    fontSize: 12,
                    padding: '2px 8px',
                    fontWeight: 700,
                  }}
                  title="카테고리 소분류"
                >
                  {stream.categoryDetail}
                </span>
              </div>
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
