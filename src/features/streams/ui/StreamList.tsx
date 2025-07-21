'use client';

import { useEffect, useState } from 'react';
import { fetchStreams, fetchViewerCounts } from '../api/streams';
import type { Stream } from '@/entities/stream/model/types';
import * as styles from './StreamList.css';
import StreamCreateForm from './StreamCreateForm';
import { useSession } from 'next-auth/react';
import PopularStreamers from '@/widgets/PopularStreamers/PopularStreamers';
import PersonalizedRecommendations from '@/widgets/PersonalizedRecommendations/PersonalizedRecommendations';
import StreamCard from './StreamCard';

// --- 카테고리 대분류/소분류 옵션 정의 (폼과 동일하게 재사용) ---
const CATEGORY_OPTIONS = [
  {
    type: 'GAME',
    label: '게임',
    details: [
      { value: 'LOL', label: 'LOL' },
      { value: 'PUBG', label: 'PUBG' },
      { value: 'OVERWATCH', label: 'OVERWATCH' },
      { value: 'VALORANT', label: 'VALORANT' },
      { value: 'CS2', label: 'CS2' },
      { value: 'DOTA2', label: 'DOTA2' },
      { value: 'ETC', label: '기타' },
    ],
  },
  {
    type: 'RADIO',
    label: '보이는 라디오',
    details: [
      { value: '토크', label: '토크' },
      { value: '여행', label: '여행' },
      { value: '음악', label: '음악' },
      { value: '버츄얼', label: '버츄얼' },
    ],
  },
  {
    type: 'SPORTS',
    label: '스포츠',
    details: [
      { value: '축구', label: '축구' },
      { value: '농구', label: '농구' },
      { value: '야구', label: '야구' },
      { value: '당구', label: '당구' },
      { value: '탁구', label: '탁구' },
    ],
  },
];

export default function StreamList() {
  const { data: session } = useSession();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [viewerCounts, setViewerCounts] = useState<Record<string, number>>({});
  // hover 상태 관리 (streamKey 기준)
  const [hoveredStreamKey, setHoveredStreamKey] = useState<string | null>(null);
  // --- 카테고리 필터 상태 ---
  const [filterType, setFilterType] = useState<string>('ALL'); // 대분류
  const [filterDetail, setFilterDetail] = useState<string>('ALL'); // 소분류

  // 썸네일 이미지 경로 생성 함수
  // const getThumbnailUrl = (streamKey: string) => `/thumbnails/${streamKey}.jpg`;
  // HLS 미리보기 영상 경로 생성 함수
  // const getHlsUrl = (streamKey: string) => `http://localhost:8080/live/${streamKey}.m3u8`;
  // const DEFAULT_THUMBNAIL = '/images/lol.png'; // 기본 썸네일

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

  // --- 카테고리별 필터링 로직 ---
  const filteredStreams = streams.filter((stream) => {
    // 전체(ALL) 선택 시 모두 표시
    if (filterType === 'ALL') return true;
    // 대분류만 선택된 경우
    if (filterDetail === 'ALL') return stream.categoryType === filterType;
    // 대분류+소분류 모두 선택된 경우
    return stream.categoryType === filterType && stream.categoryDetail === filterDetail;
  });

  return (
    <div>
      {/* --- 나만을 위한 추천(상단) --- */}
      <PersonalizedRecommendations />
      {/* --- 인기 스트리머 추천 섹션(가로 스크롤 카드형) --- */}
      <PopularStreamers />
      {/* --- 카테고리별 필터 UI (vanilla-extract 적용) --- */}
      <div className={styles.filterRow}>
        <label className={styles.filterLabel}>
          대분류
          <select
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterDetail('ALL'); // 대분류 변경 시 소분류 초기화
            }}
          >
            <option value="ALL">전체</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat.type} value={cat.type}>
                {cat.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.filterLabel}>
          소분류
          <select
            className={styles.filterSelect}
            value={filterDetail}
            onChange={(e) => setFilterDetail(e.target.value)}
            disabled={filterType === 'ALL'}
          >
            <option value="ALL">전체</option>
            {/* 대분류가 선택된 경우에만 해당 소분류 옵션 노출 */}
            {filterType !== 'ALL' &&
              CATEGORY_OPTIONS.find((cat) => cat.type === filterType)?.details.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </label>
      </div>
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
        {filteredStreams.length === 0 ? (
          <div>현재 조건에 맞는 라이브 방송이 없습니다.</div>
        ) : (
          filteredStreams.map((stream) => (
            <StreamCard
              key={stream.id}
              stream={stream}
              viewerCount={viewerCounts[stream.id] ?? stream.viewers}
              hoveredStreamKey={hoveredStreamKey}
              setHoveredStreamKey={setHoveredStreamKey}
            />
          ))
        )}
      </div>
    </div>
  );
}
